import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ConfigProvider, Flex, Form, Input, Select, message } from 'antd';

import {
  PropertyPath,
  concat,
  entries,
  filter,
  find,
  get,
  groupBy,
  has,
  isArray,
  isEmpty,
  isEqual,
  isPlainObject,
  keys,
  setWith,
  some,
} from 'lodash';

import GraphQLSchemaProvider from '@/components/business/GraphQLQuery/context/GraphQLSchemaProvider';
import { IconFont } from '@/components/ui';
import useTheme from '@/hooks/useTheme';

import { FilterContainer } from '../../style';

interface Props {
  onCancel?: () => void;
  data?: any[];
  open: boolean;
  path: string;
}
const Filters = (props: Props, ref: any) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const { onCancel, data: _data, open, path } = props || {};
  const [form] = Form.useForm();
  const [independent, setIndependent] = useState(false);
  const [nameOptions, setNameOptions] = useState<any[]>([]);
  const [operaOptions, setOperaOptions] = useState<any>({});
  const [filterItem, setFilterItem] = useState<any>({});
  const { filterData, setFilterData, refreshCheck } = useContext(GraphQLSchemaProvider);

  useEffect(() => {
    if (open) {
      init();
    }
  }, [open]);

  const getList = (obj: any, name: string) => {
    return entries(obj).map(([key, value]) => ({ name, operation: key, value }));
  };

  const init = () => {
    const filterArgs = find(_data, (e: any) => has(e, 'inputObjects'));
    setFilterItem(filterArgs);
    if (filterArgs) {
      if (isArray(filterArgs?.inputObjects)) {
        setIndependent(false);
        const { nameOptions = [], operations = {} } = filterArgs.inputObjects.reduce(
          (
            pre: { nameOptions: { value: any; label: any }[]; operations: any },
            item: { name: PropertyPath; operations: any }
          ) => {
            if (item.name && item.operations) {
              pre.nameOptions.push({
                value: item.name,
                label: item.name,
              });
              setWith(pre.operations, item.name, item.operations, Object);
            }
            return pre;
          },
          {
            nameOptions: [],
            operations: {},
          }
        );
        setNameOptions(nameOptions);
        setOperaOptions(operations);
        const data = filterData[path]?.find((item: any) => isEqual(item.name, filterArgs.name));
        if (get(filterData, path) && data && !isEmpty(data?.value) && isPlainObject(data?.value)) {
          const args = keys(data?.value).reduce((pre, key) => {
            pre = concat(pre, getList(data?.value[key], key));
            return pre;
          }, [] as any[]);
          form.setFieldsValue({
            args,
          });
        } else {
          form.setFieldsValue({
            args: [{ name: undefined, value: undefined, operation: undefined }],
          });
        }
      }
    } else {
      setIndependent(true);
      if (get(filterData, path)) {
        form.setFieldsValue({
          args: filterData[path],
        });
      } else {
        form.setFieldsValue({
          args: _data?.map((item) => ({
            name: item.name,
            value: '',
          })),
        });
      }
    }
  };

  useImperativeHandle(ref, () => {
    return {
      init,
    };
  });

  const onFinish = (values: any) => {
    if (filterItem && !independent) {
      const groupedByFields = groupBy(
        filter(values?.args, (e) => e.name && e.operation),
        (item) => `${item.name}-${item.operation}`
      );
      const hasRepeat = some(groupedByFields, (group) => group.length > 1);
      if (hasRepeat) {
        message.error(t('graphql.finish_tip'));
        return;
      }
      const argValue = values?.args?.reduce(
        (pre: any, item: any) => {
          if (item.name) {
            if (has(pre.value, item.name)) {
              const i = pre.value[item.name];
              pre.value[item.name] = {
                ...i,
              };
              if (item.operation) {
                setWith(pre.value, [item.name], { ...i, [item.operation]: item.value }, Object);
              }
            } else {
              setWith(pre.value, [item.name], { [item.operation || '']: item.value }, Object);
            }
          }
          return pre;
        },
        {
          value: {},
        }
      );
      const d = {
        ...filterData,
        [path]: [
          {
            name: filterItem?.name || '',
            value: argValue?.value,
          },
        ],
      };
      setFilterData(d);
      refreshCheck(d);
    } else {
      setFilterData({
        ...filterData,
        [path]: values?.args || undefined,
      });
      refreshCheck({
        ...filterData,
        [path]: values?.args || undefined,
      });
    }

    onCancel?.();
  };

  const clearCondition = () => {
    if (independent) {
      form.setFieldsValue({
        args: _data?.map((item) => ({
          name: item.name,
          value: '',
        })),
      });
    } else {
      form.setFieldsValue({
        args: [{ name: undefined, value: undefined, operation: undefined }],
      });
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: themeToken.colorBgRight,
          },
          Select: {
            selectorBg: themeToken.colorBgRight,
          },
          Form: {
            itemMarginBottom: 8,
          },
        },
      }}
    >
      <FilterContainer vertical gap={12}>
        <Flex style={{ overflowY: 'auto' }} flex={1}>
          <Form
            form={form}
            onFinish={onFinish}
            style={{
              width: 600,
              background: 'var(--color-bg-page)',
              borderRadius: 'var(--border-radius)',
              padding: 8,
              paddingBottom: 0,
              overflowY: 'auto',
            }}
            initialValues={{
              args: [{}],
            }}
            autoComplete="off"
          >
            <Form.List name="args">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => {
                    if (independent) {
                      return (
                        <Flex key={key} gap={8} align="baseline">
                          <Flex flex={0.2}>
                            <Form.Item
                              style={{ width: '100%' }}
                              {...restField}
                              name={[name, 'name']}
                            >
                              <Input readOnly placeholder={t('supplement.input_tip')} />
                            </Form.Item>
                          </Flex>
                          <Flex flex={0.8}>
                            <Form.Item
                              style={{ width: '100%' }}
                              {...restField}
                              name={[name, 'value']}
                            >
                              <Input placeholder={t('supplement.input_tip')} />
                            </Form.Item>
                          </Flex>
                        </Flex>
                      );
                    }
                    return (
                      <Flex key={key} gap={8} align="baseline">
                        <Flex flex={0.4}>
                          <Form.Item style={{ width: '100%' }} {...restField} name={[name, 'name']}>
                            <Select options={nameOptions} placeholder={t('common.select_tip')} />
                          </Form.Item>
                        </Flex>
                        <Flex flex={0.2}>
                          <Form.Item noStyle shouldUpdate dependencies={[name, 'name']}>
                            {({ getFieldValue }) => {
                              const args = getFieldValue('args');
                              const options = get(operaOptions, args[name]?.name) || [];
                              return (
                                <Form.Item
                                  style={{ width: '100%' }}
                                  {...restField}
                                  name={[name, 'operation']}
                                >
                                  <Select
                                    fieldNames={{ value: 'name', label: 'name' }}
                                    options={options}
                                    placeholder={t('common.select_tip')}
                                  />
                                </Form.Item>
                              );
                            }}
                          </Form.Item>
                        </Flex>
                        <Flex flex={0.4}>
                          <Form.Item noStyle shouldUpdate dependencies={[name, 'operation']}>
                            {({ getFieldValue }) => {
                              const operation = getFieldValue(['args', name, 'operation']);
                              return (
                                <Form.Item
                                  style={{ width: '100%' }}
                                  {...restField}
                                  name={[name, 'value']}
                                >
                                  {['in', 'nin'].includes(operation) ? (
                                    <Select mode="tags" placeholder={t('supplement.input_tip')} />
                                  ) : (
                                    <Input placeholder={t('supplement.input_tip')} />
                                  )}
                                </Form.Item>
                              );
                            }}
                          </Form.Item>
                        </Flex>
                        {fields.length > 1 ? (
                          <IconFont
                            className="filter-remove"
                            type="icon-error"
                            onClick={() => remove(name)}
                          />
                        ) : null}
                      </Flex>
                    );
                  })}
                  {!independent && (
                    <Form.Item noStyle>
                      <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={() => add()}
                        icon={<IconFont type="icon-add-line" />}
                      >
                        {t('api.apis_list.filter_modal.add_condition')}
                      </Button>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>
          </Form>
        </Flex>
        <Flex justify={independent ? 'flex-end' : 'space-between'}>
          {!independent && (
            <Button
              style={{ padding: 0 }}
              type="text"
              size="small"
              className="clear-btn"
              onClick={clearCondition}
              icon={<IconFont type="icon-clean" />}
            >
              {t('api.apis_list.filter_modal.clear_condition')}
            </Button>
          )}

          <Flex align="center" gap={12}>
            <Button onClick={onCancel}>{t('base.cancel')}</Button>
            <Button type="primary" onClick={() => form?.submit()}>
              {t('common.confirm')}
            </Button>
          </Flex>
        </Flex>
      </FilterContainer>
    </ConfigProvider>
  );
};

export default forwardRef(Filters);
