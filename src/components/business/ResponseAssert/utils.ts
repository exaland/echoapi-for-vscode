import Ajv, { ErrorObject } from 'ajv';
import localize from 'ajv-i18n';
import { isJson } from 'apipost-tools';
import i18next from 'i18next';
import JSON5 from 'json5';
import { isArray, isPlainObject, isString, trim } from 'lodash';
import Mock from 'mockjs';

import { ExpectItem } from '@/types/apis/base';
import { ApiSendingData } from '@/types/apis/send';
export const getTestAssertResult = async (
  expect: ExpectItem,
  response: ApiSendingData['response']
) => {
  const assertResult: {
    result: boolean;
    assertList: Array<{
      result: boolean;
      expect: string;
    }>;
  } = {
    result: true,
    assertList: [],
  };
  if (
    expect?.content_type === 'html' &&
    `${expect?.content_type}` !== `${response.mime_type?.ext}`
  ) {
    assertResult.result = false;
    assertResult.assertList.push({
      result: false,
      expect: i18next.t('common.test_component.false_content', { type: 'html' }),
    });
    return assertResult;
  }

  if (
    expect?.content_type === 'xml' &&
    `${expect?.content_type}` !== `${response.mime_type?.ext}`
  ) {
    assertResult.result = false;
    assertResult.assertList.push({
      result: false,
      expect: i18next.t('common.test_component.false_content', { type: 'xml' }),
    });
    return assertResult;
  }

  if (expect?.content_type === 'binary' && `${response?.fit_for_show}` === 'Monaco') {
    assertResult.result = false;
    assertResult.assertList.push({
      result: false,
      expect: i18next.t('common.test_component.false_content', { type: 'binary' }),
    });
    return assertResult;
  }

  if (
    expect?.content_type === 'json' &&
    expect?.verify_type === 'schema' &&
    isPlainObject(expect?.schema)
  ) {
    if (!isJson(response?.raw_body || '')) {
      assertResult.result = false;
      assertResult.assertList.push({
        result: false,
        expect: i18next.t('common.test_component.false_content', { type: 'json' }),
      });
      return assertResult;
    }

    const ajv = new Ajv({
      allErrors: true,
      strictSchema: false,
      messages: false,
      meta: false,
      validateSchema: false,
      strict: false,
    });

    try {
      const validSchema = expect.schema;
      const validate = ajv.compile(validSchema);
      const body = JSON.parse(response?.raw_body || '{}');
      const newValid = validate(body);

      assertResult.result = newValid;

      const localizeLanguage = i18next.language === 'zh-cn' ? 'zh' : 'en';
      localize[localizeLanguage](validate.errors);

      if (isArray(validate.errors)) {
        validate.errors.forEach((item) => {
          assertResult.assertList.push({
            result: false,
            expect: genAssertExpectMsg(item),
          });
        });
      }
    } catch (error) {}
  }

  if (
    expect?.content_type === 'json' &&
    expect?.verify_type === 'mock' &&
    isString(expect?.mock) &&
    trim(expect.mock).length > 0
  ) {
    if (!isJson(response?.raw_body || '')) {
      assertResult.result = false;
      assertResult.assertList.push({
        result: false,
        expect: i18next.t('common.test_component.false_content', { type: 'json' }),
      });
      return assertResult;
    }
    try {
      const mockObj = JSON5.parse(expect.mock);
      const body = JSON.parse(response.raw_body || '{}');
      const mockJsErrs = Mock.valid(mockObj, body);
      if (isArray(mockJsErrs) && mockJsErrs.length > 0) {
        assertResult.result = false;
        mockJsErrs?.forEach((item) => {
          assertResult.assertList.push({
            result: false,
            expect: item.message,
          });
        });
      }
    } catch (error) {}
  }
  return assertResult;
};

const genAssertExpectMsg = (item: ErrorObject<string, Record<string, any>, unknown>) => {
  const genInstancePath = item.instancePath?.split('/')?.join('.');

  if (genInstancePath) {
    return `$${genInstancePath} ${item.message}`;
  }

  return `$ ${item.message}`;
};
