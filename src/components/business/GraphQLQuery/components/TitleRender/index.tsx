import { memo, useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge, Flex } from 'antd';
import { DataNode } from 'antd/es/tree';

import { useSafeState } from 'ahooks';
import classNames from 'classnames';
import {
  entries,
  find,
  get,
  has,
  includes,
  isArray,
  isEmpty,
  isEqual,
  isPlainObject,
  keys,
  size,
} from 'lodash';

import GraphQLSchemaProvider from '@/components/business/GraphQLQuery/context/GraphQLSchemaProvider';
import { Tooltip } from '@/components/ui';
import { Popover } from '@/components/ui';

import Filters from '../Filters';

import { PopoverFilterContainer, TitleRenderContainer } from '../../style';

const TitleRender = memo((props: DataNode | any) => {
  const { t } = useTranslation();
  const { name, kind, itemKind, description, non_null, args, path, readOnly = false } = props || {};
  const { filterData } = useContext(GraphQLSchemaProvider);

  const count = useMemo(() => {
    if (isEmpty(args)) return 0;
    const filterArgs = find(args, (e: any) => has(e, 'inputObjects'));
    if (filterArgs) {
      if (isArray(filterArgs?.inputObjects)) {
        const data = filterData[path]?.find((item: any) => isEqual(item.name, filterArgs.name));
        if (get(filterData, path) && data && data?.value) {
          return entries(data?.value).reduce((pre, [_key, obj]) => {
            if (isPlainObject(obj)) {
              pre += size(keys(obj));
            }
            return pre;
          }, 0);
        }
      }
    } else {
      return size(filterData[path]);
    }
    return 0;
  }, [filterData, args, path]);

  const [filterOpen, setFilterOpen] = useSafeState<boolean>(false);
  const filterRef = useRef<any>(null);
  const kindType = useMemo(() => {
    let type = itemKind;
    if (non_null !== undefined) {
      type += '!';
    }
    if (includes(['array'], kind)) {
      type = `[${type}]`;
    }
    return type;
  }, [itemKind, kind, non_null]);
  return (
    <TitleRenderContainer align="center" justify="space-between">
      <Flex align="center" className="title-container" gap={12}>
        <div
          className={classNames('input', {
            noDesc: !description,
          })}
        >{`${name}`}</div>
        <div
          className={classNames('type', {
            null: non_null !== undefined,
            array: includes(['array'], kind),
            noDesc: !description,
          })}
        >
          {kindType}
        </div>
        {description && <div className="desc">{description}</div>}
      </Flex>
      <Flex align="center" gap={8}>
        {!isEmpty(args) && !readOnly && (
          <Popover
            open={filterOpen}
            onOpenChange={(open) => {
              setFilterOpen(open);
            }}
            placement="bottom"
            trigger={'click'}
            content={
              <PopoverFilterContainer onClick={(e) => e?.stopPropagation()}>
                <Filters
                  path={path}
                  open={filterOpen}
                  ref={filterRef}
                  data={args}
                  onCancel={() => setFilterOpen(false)}
                />
              </PopoverFilterContainer>
            }
          >
            <Badge size="small" offset={[-2, 0]} count={count}>
              <Tooltip title={t('graphql.filter')}>
                <Flex
                  className="action-outer primary"
                  onClick={(e) => {
                    e?.stopPropagation();
                    if (readOnly) return;
                    setFilterOpen(true);
                  }}
                  justify="center"
                  align="center"
                >
                  Filter
                </Flex>
              </Tooltip>
            </Badge>
          </Popover>
        )}
      </Flex>
    </TitleRenderContainer>
  );
});

export default TitleRender;
