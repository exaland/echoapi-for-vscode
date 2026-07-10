import { Kind, print } from 'graphql';

export function json2graphql(tree) {
  // Create AST node
  const ast = {
    kind: Kind.DOCUMENT,
    definitions: [createOperationDefinition(tree)],
  };
  // Use graphql-js print function to convert AST to string
  return print(ast);
}

export function createOperationDefinition(tree) {
  return {
    kind: Kind.OPERATION_DEFINITION,
    operation: tree.operation || 'query',
    name: createName(tree.name),
    variableDefinitions: createVariableDefinitions(tree.variables),
    directives: [],
    selectionSet: createSelectionSet(tree.children || tree.fields),
  };
}

function createName(name) {
  if (!name) return null;
  return {
    kind: Kind.NAME,
    value: name,
  };
}

function createVariableDefinitions(variables) {
  if (!variables || !variables.length) return [];

  return variables.map((variable) => ({
    kind: Kind.VARIABLE_DEFINITION,
    variable: {
      kind: Kind.VARIABLE,
      name: createName(variable.name),
    },
    type: createType(variable.type, variable.required),
    defaultValue: undefined,
    directives: [],
  }));
}

function createType(type, required) {
  const namedType = {
    kind: Kind.NAMED_TYPE,
    name: createName(type),
  };

  if (required) {
    return {
      kind: Kind.NON_NULL_TYPE,
      type: namedType,
    };
  }

  return namedType;
}

function createSelectionSet(fields) {
  if (!fields || !fields.length)
    return {
      kind: Kind.SELECTION_SET,
      selections: [],
    };

  return {
    kind: Kind.SELECTION_SET,
    selections: fields.map(createField),
  };
}

function createField(field) {
  return {
    kind: Kind.FIELD,
    name: createName(field.name),
    arguments: createArguments(field.arguments),
    directives: createDirectives(field.directives),
    selectionSet: createSelectionSet(field.children || field.fields),
  };
}

export function createArguments(args) {
  if (!args || !args.length) return [];

  return args.map((arg) => ({
    kind: Kind.ARGUMENT,
    name: createName(arg.name),
    value: createValue(arg.value),
  }));
}

function createDirectives(directives) {
  if (!directives || !directives.length) return [];

  return directives.map((directive) => ({
    kind: Kind.DIRECTIVE,
    name: createName(directive.name),
    arguments: createArguments(directive.arguments),
  }));
}

function createValue(value) {
  if (value === null || value === undefined) {
    return { kind: Kind.NULL };
  }

  if (typeof value === 'string') {
    if (value.startsWith('$')) {
      return {
        kind: Kind.VARIABLE,
        name: createName(value.substring(1)),
      };
    }
    return {
      kind: Kind.STRING,
      value: value,
    };
  }

  if (typeof value === 'number') {
    return {
      kind: Kind.INT,
      value: String(value),
    };
  }

  if (typeof value === 'boolean') {
    return {
      kind: Kind.BOOLEAN,
      value: value,
    };
  }

  if (Array.isArray(value)) {
    return {
      kind: Kind.LIST,
      values: value.map(createValue),
    };
  }

  if (typeof value === 'object') {
    return {
      kind: Kind.OBJECT,
      fields: Object.entries(value).map(([key, val]) => ({
        kind: Kind.OBJECT_FIELD,
        name: createName(key),
        value: createValue(val),
      })),
    };
  }

  return { kind: Kind.NULL };
}
