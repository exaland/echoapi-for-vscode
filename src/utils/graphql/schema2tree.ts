import _, { has, isEqual, map, union } from 'lodash';

function getQueryTypeInfo(typeObj) {
  // If no ofType, return current type info directly
  if (!typeObj.ofType) {
    return {
      kind: typeObj.kind.toLowerCase(),
      itemKind: typeObj.name,
    };
  }

  // If LIST type, recursively process and return array type
  if (typeObj.kind === 'LIST') {
    const innerType = getQueryTypeInfo(typeObj.ofType);
    return {
      kind: 'array',
      itemKind: innerType.itemKind,
    };
  }

  // Continue recursively processing other types
  return getQueryTypeInfo(typeObj.ofType);
}

function transformQuery(queryData, ids) {
  ids.push('Query');
  const result = {
    Query: {
      name: queryData.name,
      kind: queryData.kind.toLowerCase(),
      path: 'Query',
      key: 'Query',
      children: [],
      checkable: false,
    },
  };

  if (queryData.fields) {
    result.Query.children = queryData.fields.map((field) => {
      const typeInfo = getQueryTypeInfo(field.type);
      ids.push(`${result.Query.key}.${field.name}`);
      return {
        key: `${result.Query.key}.${field.name}`,
        name: field.name,
        ...typeInfo,
        path: `${result.Query.key}.${field.name}`,
        args: field?.args,
      };
    });
  }

  return result;
}

export const getChildTree = (field: any, raw: string) => {
  const objects = transformStructure({ objects: raw.objects });
  if (isEqual(field?.key, 'Query')) {
    return field?.children;
  }
  if (objects.objects[field.itemKind]) {
    const obj = _.cloneDeep(objects.objects[field.itemKind]);
    const modifyPaths = objects.objectPaths.filter((path) => path.startsWith(`${field.itemKind}.`));
    if (modifyPaths.length) {
      for (const modifyPath of modifyPaths) {
        const newPath = modifyPath.replace(`${field.itemKind}.`, '');
        updateObjectByPath(obj, newPath, {
          key: `${field.key}.${newPath}`,
          path: `${field.key}.${newPath}`,
        });
      }
    }

    return map(obj.children, (item) => {
      return {
        ...item,
        ...(has(objects.objects, item?.itemKind) ? { children: [] } : { isLeaf: true }),
      };
    });
  }
};

export const raw2tree = (raw) => {
  const objects = transformStructure({ objects: raw.objects });
  const inputObjects = transformInputObjects(raw.inputObjects);
  const tree = {};
  const ids = [];
  if (Array.isArray(raw?.queries?.fields)) {
    const queryInfo = transformQuery(raw.queries, ids);
    for (let i = 0; i < queryInfo.Query.children.length; i++) {
      const field = queryInfo.Query.children[i];
      if (objects.objects[field.itemKind]) {
        const obj = _.cloneDeep(objects.objects[field.itemKind]);
        const modifyPaths = objects.objectPaths.filter((path) =>
          path.startsWith(`${field.itemKind}.`)
        );
        if (modifyPaths.length) {
          for (const modifyPath of modifyPaths) {
            const newPath = modifyPath.replace(`${field.itemKind}.`, '');
            updateObjectByPath(obj, newPath, {
              key: `${field.key}.${newPath}`,
              path: `${field.key}.${newPath}`,
            });
            ids.push(`${field.key}.${newPath}`);
          }
        }
        queryInfo.Query.children[i].children = [];
      }
      if (field.args && Array.isArray(field.args)) {
        const args = [];
        for (const arg of field.args) {
          if (arg?.type?.name) {
            // List style
            const inputObject = inputObjects.inputObjects[arg.type.name];
            if (inputObject) {
              args.push({
                name: arg.name,
                description: arg.description,
                defaultValue: arg.defaultValue,
                itemKind: arg.type.name,
                inputObjects: inputObject,
              });
            } else {
              args.push({
                name: arg.name,
                description: arg.description,
                defaultValue: arg.defaultValue,
                itemKind: arg.type.name,
                inputObjects: [],
              });
            }
          } else if (arg?.type?.ofType) {
            // Single object style
            args.push({
              name: arg.name,
              description: arg.description,
              defaultValue: arg.defaultValue,
              itemKind: arg.type.ofType.name,
            });
          }
        }
        queryInfo.Query.children[i].args = args;
      }
      //delete queryInfo.Query.children[i].args;
    }
    tree.Query = queryInfo.Query;
  }
  return {
    tree,
    ids: union(ids),
  };
};

function getTypeInfo(typeObj, objects, processedTypes = new Set()) {
  const isNonNull = typeObj.kind === 'NON_NULL';
  // Basic type - return directly
  if (!typeObj.ofType) {
    return {
      kind: typeObj.kind.toLowerCase(),
      itemKind: typeObj.name,
      non_null: isNonNull,
      description: typeObj.description || null,
      defaultValue: typeObj.defaultValue || null,
    };
  }

  // Handle LIST type
  if (typeObj.kind === 'LIST') {
    const innerType = getTypeInfo(typeObj.ofType, objects, processedTypes);
    return {
      kind: 'array',
      itemKind: innerType.itemKind,
      non_null: isNonNull,
      description: typeObj.description || null,
      defaultValue: typeObj.defaultValue || null,
    };
  }

  // Recursively process nested types
  return getTypeInfo(typeObj.ofType, objects, processedTypes);
}

function transformObject(objData, objects, processedTypes = new Set()) {
  // If this object has been processed, return null to avoid circular references
  if (processedTypes.has(objData.name)) {
    return null;
  }

  // Mark current object as processed
  processedTypes.add(objData.name);

  const objResult = {
    name: objData.name,
    kind: objData.kind.toLowerCase(),
    description: objData.description || null,
    children: [],
  };

  if (objData.fields) {
    objResult.children = objData.fields.map((field) => {
      const typeInfo = getTypeInfo(field.type, objects, processedTypes);
      const result = {
        name: field.name,
        description: field.description || null,
        ...typeInfo,
      };

      // If it's an object type and not processed, add its children
      if (typeInfo.itemKind && objects[typeInfo.itemKind]) {
        const transformedObject = transformObject(
          { ...objects[typeInfo.itemKind], name: typeInfo.itemKind },
          objects,
          new Set(processedTypes) // Create a new Set to avoid affecting other branches
        );
        if (transformedObject) {
          result.children = transformedObject.children;
        }
      }

      return result;
    });
  }

  return objResult;
}

function collectPaths(obj, parentPath = '', result = []) {
  // If current object is an array
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      if (typeof item === 'object' && item !== null) {
        // Collect current path
        const currentPath = parentPath ? `${parentPath}.${item.name}` : item.name;
        result.push(currentPath);

        // If has children, continue recursion
        if (item.children) {
          collectPaths(item.children, currentPath, result);
        }
      }
    });
  }
  // If it's an object
  else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === 'children' && Array.isArray(value)) {
        collectPaths(value, parentPath, result);
      } else if (typeof value === 'object' && value !== null) {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;
        if (value.name) {
          result.push(currentPath);
        }
        if (value.children) {
          collectPaths(value.children, currentPath, result);
        }
      }
    });
  }

  return result;
}

export function getObjectByPath(obj, path) {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (!current) return undefined;

    // If current node has children array, find the object with matching name
    if (Array.isArray(current.children)) {
      const found = current.children.find((child) => child.name === part);
      if (found) {
        current = found;
        continue;
      }
    }

    // Otherwise directly lookup property
    current = current[part];
  }

  return current;
}

export function updateObjectByPath(obj, path, updates) {
  delete updates.name;
  const parts = path.split('.');
  let current = obj;
  const nodes = [current];

  // Find the parent node of target node
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current) return false;

    if (Array.isArray(current.children)) {
      const found = current.children.find((child) => child.name === part);
      if (found) {
        current = found;
        nodes.push(current);
        continue;
      }
    }

    current = current[part];
    nodes.push(current);
  }

  // The last part is the node to update
  const lastPart = parts[parts.length - 1];
  if (Array.isArray(current.children)) {
    const index = current.children.findIndex((child) => child.name === lastPart);
    if (index !== -1) {
      // Merge update
      current.children[index] = {
        ...current.children[index],
        ...updates,
      };
      return true;
    }
  }

  return false;
}

export function transformStructure(data) {
  const result = { objects: {}, objectPaths: [] };
  const processedTypes = new Set();

  Object.entries(data?.objects).forEach(([objName, objData]) => {
    if (!processedTypes.has(objName)) {
      result.objects[objName] = transformObject(
        { ...objData, name: objName },
        data?.objects,
        processedTypes
      );
    }
  });

  result.objectPaths = collectPaths(result.objects);

  return result;
}

function transformInputObjects(inputObjects: { [key: string]: any }): {
  inputObjects: { [key: string]: any };
} {
  const transformed = { inputObjects: {} };

  for (const key in inputObjects) {
    if (inputObjects[key].inputFields) {
      transformed.inputObjects[key] = [];
      for (const field of inputObjects[key].inputFields) {
        const transformedField = {
          name: field.name,
          description: field.description,
          defaultValue: field.defaultValue,
          operations: [],
        };

        const fieldType = field.type;
        if (fieldType.kind === 'INPUT_OBJECT' && inputObjects[fieldType.name]) {
          for (const operation of inputObjects[fieldType.name].inputFields) {
            transformedField.operations.push({
              name: operation.name,
              description: operation.description,
              defaultValue: operation.defaultValue,
              type: operation.type.name,
            });
          }
        }

        transformed.inputObjects[key].push(transformedField);
      }
    }
  }

  return transformed;
}
