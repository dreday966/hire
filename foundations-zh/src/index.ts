import {includes} from 'lodash';

export interface ErrorMessage {
  message: string
  stack: {
    line: number
    column: number
    filename: string
  }[]
}

export function parseError(err: Error): ErrorMessage {
  const {stack, message} =  err;
  let stackArray: {
    line: number
    column: number
    filename: string
  }[] = [];

  if (stack) {
    const lines = stack.split("\n");
    const parseUrl = (url: string) => {
      const segements = url.split(':');
      return {
        filename: segements.slice(0, segements.length - 2).join(':'),
        line: parseInt(segements[segements.length - 2], 10),
        column: parseInt(segements[segements.length - 1], 10)
      }
    }

    if (lines[0] === 'TypeError: Error raised'){
      stackArray = lines.slice(1, lines.length - 1)
      .map(str => {
        const segements = str.trim().split(' ');
        return segements[segements.length - 1];
      })
      .filter(str => !includes(str, '<anonymous>'))
      .map(parseUrl);
    } else {
      stackArray = lines.slice(1, lines.length - 1)
      .map(str => {
        const segements = str.trim().split('@');
        return segements[segements.length - 1];
      })
      .filter(str => !includes(str, '<anonymous>'))
      .map(parseUrl);
    }
  }
  return {
    message, stack: stackArray
  }
}
