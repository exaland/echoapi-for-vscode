import { FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckboxProps } from 'antd';

import { useMemoizedFn, useSafeState } from 'ahooks';
import produce from 'immer';
import { forEach, isArray, isEqual, size } from 'lodash';

import BasicTable from '@/components/business/BasicTable';

import { RequestTableProps } from './types';

import { BasicTableWrap, RequestTableContainer } from './style';
import { ParametersItem } from '@/types/apis/api';
import ParameterConversion from '../ParameterConversion';
import ColumnConfig from '../RequestTable/components/ColumnConfig';
import { PARAMETER_TYPE } from '../RequestTable/types';

const RequestTable: FC<RequestTableProps> = memo(
  ({
    dataSource = [],
    onChange,
    tabType,
    onChangeQueryAddEqual,
    queryAddEqual,
    readOnly,
    bodyMode,
    showAiDescription = true,
    columnSwitchConfig,
    onColumnSwitchConfig
  }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useSafeState(false);

    const [parameterType, setParameterType] = useSafeState<PARAMETER_TYPE>(PARAMETER_TYPE.EXPORT);

    const getDefaultItem = () => {
      let defaultItem = {
        name: '',
        in: tabType,
        description: '',
        required: true,
        example: '',
        schema: {
          type: "string"
        },
        static: true
      };
      return defaultItem;
    };

    const tableDataList = useMemo(() => {
      const defaultItem = getDefaultItem();
      if (!isArray(dataSource)) {
        return [defaultItem as ParametersItem];
      }
      return [...dataSource, defaultItem as ParametersItem];
    }, [dataSource]);

    const allCheckboxStatus = useMemo(() => {
      const status = {
        checked: false,
        indeterminate: false,
      };

      // None selected
      if (
        size(dataSource) > 0 &&
        every(dataSource, (item) => !item?.required)
      ) {
        return status;
      }

      // All selected
      if (every(dataSource, (item) => item?.required)) {
        status.checked = true;
      }

      // Partially selected
      if (some(dataSource, (item) => !item?.required)) {
        status.indeterminate = true;
      }

      return status;
    }, [dataSource]);

    const handleCheckAll: CheckboxProps['onChange'] = useMemoizedFn((event) => {
      const newDataSource = produce(dataSource, (draft) => {
        forEach(draft, (item) => {
          item.required = event.target.checked ? true : false;
        });
      });

      onChange?.(newDataSource);
    });

    const handleItemOnChange = useMemoizedFn((rowIndex: number, rowData: ParametersItem) => {
      const newDataSource = produce(dataSource, (draft: (ParametersItem | any)[]) => {
        draft[rowIndex] = rowData;

        // Key and value must not be empty, and not in read-only mode, to allow adding new rows
        if ((rowData?.name || rowData?.example) && !readOnly) {
          delete draft[rowIndex].static;
        }
      });

      onChange?.(newDataSource);
    });

    const onDelete = useMemoizedFn((rowIndex: number) => {
      const newDataSource = produce(dataSource, (draft: ParametersItem[]) => {
        draft.splice(rowIndex, 1);
      });

      onChange?.(newDataSource);
    });

    const rowKeyRender = (_: string, record: ParametersItem, index: number) => (
      <RowKey
        readOnly={readOnly}
        tabType={tabType}
        bodyMode={bodyMode}
        onChange={handleItemOnChange}
        rowData={record}
        rowIndex={index}
        showAiDescription={showAiDescription}
        showCheckbox={false}
      />
    );

    const rowKeyTitleRender = () => (
      <RowKeyTitle
        tabType={tabType}
        queryAddEqual={queryAddEqual}
        allCheckboxStatus={allCheckboxStatus}
        handleCheckAll={handleCheckAll}
        onChangeQueryAddEqual={onChangeQueryAddEqual}
      />
    );

    const rowValueRender = (_: string, record: ParametersItem, index: number) => (
      <RowValue
        readOnly={readOnly}
        onChange={handleItemOnChange}
        tabType={tabType}
        rowData={record}
        rowIndex={index}
        bodyMode={bodyMode}
      />
    );

    const rowDescriptionTitleRender = () => (
      <RowDescriptionTitle
        onAiModal={handleAiModal}
        tabType={tabType}
        setOpen={setOpen}
      />
    );

    const rowDescriptionRender = (_: string, record: ParametersItem, index: number) => (
      <RowDescription
        readOnly={readOnly}
        onChange={handleItemOnChange}
        onDelete={onDelete}
        rowData={record}
        rowIndex={index}
        showAiDescription={showAiDescription}
      />
    );

    const tableColumns = () => {
      const columns = [
        {
          key: 'name',
          dataIndex: 'name',
          title: rowKeyTitleRender,
          render: rowKeyRender,
        },
        {
          key: 'example',
          dataIndex: 'example',
          title: t('common.request_table.param_value'),
          render: rowValueRender,
        },
        {
          key: 'description',
          dataIndex: 'description',
          title: rowDescriptionTitleRender,
          render: rowDescriptionRender,
        },
      ];

      if (isEqual(tabType, 'event')) {
        columns.splice(1, 1);
      }

      return columns?.map((colItem, colIndex) => ({
        ...colItem,
        ...(!isEqual(colIndex, size(columns) - 1) ? { width: 320 } : {}),
      }));
    };

    const parameterChange = (value: ApisBaseDataItem[]) => {
      if (isArray(value)) {
        onChange?.(value.map(i => {
          return {
            name: i?.key || '',
            in: tabType,
            description: i?.description || '',
            required: i.not_null === 1,
            example: i?.value || '',
            schema: {
              type: i?.field_type?.toLowerCase() || 'string'
            }
          } as ParametersItem;
        }));
      }
      setOpen(false);
    };

    return (
      <RequestTableContainer>
        <BasicTableWrap>
          <BasicTable
            rowKey="param_id"
            cellPadding={0}
            dragLastDisabled
            resizableColEnable
            dataSource={tableDataList}
            columns={tableColumns()}
          />
          <ColumnConfig
            onAiModal={handleAiModal}
            tabType={tabType}
            setParameterType={setParameterType}
            setOpen={setOpen}
            bodyMode={bodyMode}
            columnSwitchConfig={columnSwitchConfig}
            onColumnSwitchConfig={onColumnSwitchConfig}
          />
        </BasicTableWrap>
        <ParameterConversion
          value={dataSource}
          onCancel={() => setOpen(false)}
          parameterType={parameterType}
          open={open}
          onChange={parameterChange}
        />
      </RequestTableContainer>
    );
  }
);

export default RequestTable;
function handleAiModal(): void {
  throw new Error('Function not implemented.');
}

