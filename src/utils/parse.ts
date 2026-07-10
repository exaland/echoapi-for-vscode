import aptTools from 'apipost-tools';
import iconv from 'iconv-lite';
import { isString } from 'lodash';

export const parseStreamToRaw: (
  stream: ArrayBuffer | undefined,
  mimeType: object,
  encode?: string
) => string = (stream, mimeType, encode = 'utf8') => {
  const bufferToRaw = aptTools.bufferToRaw(stream, mimeType);
  const { buffer } = bufferToRaw;

  let rawBody = bufferToRaw.raw;
  const rawEncode = isString(encode) ? encode : 'utf8';

  try {
    rawBody = iconv.decode(buffer, rawEncode);
  } catch (error) {}

  return rawBody;
};

export const parseStreamToBody: (
  stream: ArrayBuffer,
  mimeType: object,
  encode?: string
) => {
  rawBody: string;
  base64Body: string;
} = (stream, mimeType, encode = 'utf8') => {

  const bufferToRaw = aptTools.bufferToRaw(stream, mimeType);
  let rawBody = bufferToRaw.raw;

  try {
    if (rawBody.indexOf('�') > -1) {
      rawBody = iconv.decode(bufferToRaw?.buffer, 'GBK');
    } else {
      rawBody = iconv.decode(bufferToRaw?.buffer, encode);
    }
  } catch (error) {}

  const base64Body = bufferToRaw.base64;

  return {
    rawBody,
    base64Body,
  };
};