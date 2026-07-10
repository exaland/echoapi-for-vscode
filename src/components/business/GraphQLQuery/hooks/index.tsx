import { useApis } from '@/store';
import { GraphQLDetailsData } from '@/types/apis/graphql';
import { message } from 'antd';
import produce from 'immer';
import {
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';


interface SchemaType {
  queries: Record<string, unknown>;
  mutations: Record<string, unknown>;
  subscriptions: Record<string, unknown>;
  objects: Record<string, unknown>;
  interfaces: Record<string, unknown>;
  unions: Record<string, unknown>;
  enums: Record<string, unknown>;
  inputObjects: Record<string, unknown>;
  scalars: Record<string, unknown>;
  directives: Record<string, unknown>;
}

class InspectSchema {
  schema: SchemaType;
  constructor() {
    this.schema = {
      queries: {},
      mutations: {},
      subscriptions: {},
      objects: {},
      interfaces: {},
      unions: {},
      enums: {},
      inputObjects: {},
      scalars: {},
      directives: {},
    };
  }

  // Parse type reference
  parseTypeRef(type, depth = 0) {
    if (!type) return null;
    if (depth > 7) return null; // Prevent infinite recursion

    const typeInfo = {
      kind: type.kind,
      name: type.name,
    };

    if (type.ofType) {
      typeInfo.ofType = this.parseTypeRef(type.ofType, depth + 1);
    }

    return typeInfo;
  }

  // Parse input value (parameter or input field)
  parseInputValue(input) {
    if (!input) return null;
    return {
      name: input.name,
      description: input.description,
      type: this.parseTypeRef(input.type),
      defaultValue: input.defaultValue,
    };
  }

  // Parse field
  parseField(field) {
    if (!field) return null;
    return {
      name: field.name,
      description: field.description,
      type: this.parseTypeRef(field.type),
      args: field.args?.map((arg) => this.parseInputValue(arg)) || [],
      isDeprecated: field.isDeprecated,
      deprecationReason: field.deprecationReason,
    };
  }

  // Parse enum value
  parseEnumValue(enumValue) {
    return {
      name: enumValue.name,
      description: enumValue.description,
      isDeprecated: enumValue.isDeprecated,
      deprecationReason: enumValue.deprecationReason,
    };
  }

  // Parse full type
  parseFullType(type) {
    const typeInfo = {
      kind: type.kind,
      name: type.name,
      description: type.description,
    };

    switch (type.kind) {
      case 'OBJECT':
      case 'INTERFACE':
        typeInfo.fields = type.fields?.map((f) => this.parseField(f)) || [];
        typeInfo.interfaces = type.interfaces?.map((i) => this.parseTypeRef(i)) || [];
        break;

      case 'INPUT_OBJECT':
        typeInfo.inputFields = type.inputFields?.map((f) => this.parseInputValue(f)) || [];
        break;

      case 'ENUM':
        typeInfo.enumValues = type.enumValues?.map((v) => this.parseEnumValue(v)) || [];
        break;

      case 'UNION':
        typeInfo.possibleTypes = type.possibleTypes?.map((t) => this.parseTypeRef(t)) || [];
        break;
    }

    return typeInfo;
  }

  // Organize schema
  organizeSchema(schemaData) {
    // Record root type names
    const queryTypeName = schemaData.queryType?.name;
    const mutationTypeName = schemaData.mutationType?.name;
    const subscriptionTypeName = schemaData.subscriptionType?.name;

    // Process all types
    schemaData.types.forEach((type) => {
      if (type.name.startsWith('__')) return; // Skip built-in types

      const parsedType = this.parseFullType(type);

      switch (type.kind) {
        case 'OBJECT':
          if (type.name === queryTypeName) {
            this.schema.queries = parsedType;
          } else if (type.name === mutationTypeName) {
            this.schema.mutations = parsedType;
          } else if (type.name === subscriptionTypeName) {
            this.schema.subscriptions = parsedType;
          } else {
            this.schema.objects[type.name] = parsedType;
          }
          break;
        case 'INTERFACE':
          this.schema.interfaces[type.name] = parsedType;
          break;
        case 'UNION':
          this.schema.unions[type.name] = parsedType;
          break;
        case 'ENUM':
          this.schema.enums[type.name] = parsedType;
          break;
        case 'INPUT_OBJECT':
          this.schema.inputObjects[type.name] = parsedType;
          break;
        case 'SCALAR':
          this.schema.scalars[type.name] = parsedType;
          break;
      }
    });

    // Process directives
    if (schemaData.directives) {
      schemaData.directives.forEach((directive) => {
        this.schema.directives[directive.name] = {
          name: directive.name,
          description: directive.description,
          locations: directive.locations,
          args: directive.args?.map((arg) => this.parseInputValue(arg)) || [],
        };
      });
    }

    return this.schema;
  }

  // Get full type name (including non-null and list modifiers)
  getFullTypeName(type) {
    if (!type) return 'Unknown';
    if (type.kind === 'NON_NULL') {
      return `${this.getFullTypeName(type.ofType)}!`;
    }
    if (type.kind === 'LIST') {
      return `[${this.getFullTypeName(type.ofType)}]`;
    }
    return type.name;
  }

  // Generate type documentation
  generateTypeDoc() {
    let doc = '';

    // Queries
    if (Object.keys(this.schema.queries).length > 0) {
      doc += '# Queries\n\n';
      this.schema.queries.fields.forEach((field) => {
        doc += `## ${field.name}\n`;
        if (field.description) doc += `${field.description}\n\n`;
        doc += `Type: ${this.getFullTypeName(field.type)}\n\n`;
        if (field.args.length > 0) {
          doc += 'Arguments:\n';
          field.args.forEach((arg) => {
            doc += `- ${arg.name}: ${this.getFullTypeName(arg.type)}`;
            if (arg.defaultValue) doc += ` = ${arg.defaultValue}`;
            if (arg.description) doc += ` - ${arg.description}`;
            doc += '\n';
          });
        }
        doc += '\n';
      });
    }

    // Add documentation for other types similarly...

    return doc;
  }
}

const useGraphQLQuery = () => {
  const { t } = useTranslation();
  const handelGraphQLSchemaFetchResult = (result: { code: number, data: any, error?:string }) => {
    const {updateApisActiveData, apisActiveData ,updateSchemaLoading} = useApis.getState();
    const { code, data, error } = result;
    if (code !== 200 || error) {
      message.error(code === 200 ? error : 'Refresh failed, GraphQL Schema not retrieved.');
      updateSchemaLoading(false);
      return;
    }

    if (data?.errors) {
      message.error(`GraphQL Errors: ${JSON.stringify(data.errors)}`);
      updateSchemaLoading(false);
      return;
    }

    const inspectSchema = new InspectSchema();
    const organizedSchema = inspectSchema.organizeSchema(data?.data?.__schema || {});

    if (apisActiveData) {
      const newData = produce(apisActiveData, (draft : GraphQLDetailsData) => {
        draft.request.body = {
          ...draft.request.body,
          query_schema:organizedSchema
        };
      });
      updateApisActiveData?.(newData);
    }

    message.success(t('supplement.refresh_success'));
    updateSchemaLoading(false);
  }

  return {
    handelGraphQLSchemaFetchResult
  };
};

export default useGraphQLQuery;
