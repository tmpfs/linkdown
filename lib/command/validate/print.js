var util = require('util')
  , ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi
  , repeat = require('string-repeater')
  , wrap = require('wordwrap')
  , defaultStyles = require('../../styles/defaults')
  , validationStyles = require('../../styles/validation');

/**
 *  Print the validation result.
 *
 *  @see https://github.com/validator/validator/wiki/Output%3A-JSON
 */
function printer(result, map) {

  // change output styles for validation messages
  ttycolor.styles(validationStyles);

  var messages = result.messages
    , i
    , msg
    , type
    , message
    , method = 'info'
    , info = map[messages[0].url]
    , fields
    , index
    , space = ' '
    , indent = space + space
    , firstLine
    , lastLine
    , firstColumn
    , lastColumn
    , position
    , extractFirst
    , extractHilite
    , extractLast
    , pointer
    , wrapAt = 80;

  for(i = 0;i < messages.length;i++) {
    msg = messages[i];
    type = msg.type;
    index = (i + 1) + ')';
    message = msg.message;

    firstLine = msg.firstLine || msg.lastLine;
    lastLine = msg.lastLine;
    /* istanbul ignore next: not sure if firstColumn is optional */
    firstColumn = msg.firstColumn || msg.lastColumn;
    lastColumn = msg.lastColumn;

    position = util.format(
      'From line %s, column %s; to line %s, column %s',
      firstLine,
      firstColumn,
      lastLine,
      lastColumn);

    if(type === 'error') {
      method = 'error';
    /* istanbul ignore else: will defer to `info` otherwise */
    }else if(type === 'info' && msg.subType === 'warning') {
      method = 'warn'; 
    }

    fields = {prefix: 'HTML', validator: msg};

    // initial empty line, makes parsing the output easier on the eyes
    if(i === 0) {
      this.log[method].call(this.log, fields, space);
    }

    // always print url, when there are lots of errors the 
    // context can be lost otherwise
    this.log[method].call(
      this.log, fields, '%s %s', ansi(index).normal, ansi(info.url).underline);
    this.log[method].call(this.log, fields, space);

    //print position information
    this.log[method].call(
      this.log, fields, '%s', ansi(position).normal);
    this.log[method].call(this.log, fields, space);

    /* istanbul ignore else: docs say everything but `type` is optional */
    if(message) {
      if(message.length > wrapAt) {
        message = wrap(wrapAt)(message); 
      }
      this.log[method].call(this.log, fields, message);
      this.log[method].call(this.log, fields, space);
    }

    /* istanbul ignore else: docs say everything but `type` is optional */
    if(msg.extract) {

      // WARN: quick hack for when the extract contains newlines
      // WARN: this needs more consideration
      msg.extract = msg.extract.replace('\n', '\\n');

      /* istanbul ignore else: docs say everything but `type` is optional */
      if(typeof(msg.hiliteStart) === 'number'
        && typeof(msg.hiliteLength) === 'number') {
        extractFirst = msg.extract.substr(0, msg.hiliteStart);
        extractHilite = msg.extract.substr(msg.hiliteStart, msg.hiliteLength);
        extractLast = msg.extract.substr(msg.hiliteStart + msg.hiliteLength);
        this.log[method].call(
          this.log, fields,
            indent + '%s%s%s',
            ansi(extractFirst).normal,
            ansi(extractHilite).yellow,
            ansi(extractLast).normal);

        pointer = repeat('-', indent.length + msg.hiliteStart);
        pointer += '^';
        this.log[method].call(this.log, fields, pointer);

        this.log[method].call(this.log, fields, space);
      }else{
        this.log[method].call(this.log, fields, indent + msg.extract);
        this.log[method].call(this.log, fields, space);
      }
    }
  }

  // restore default styles
  ttycolor.styles(defaultStyles);
}

module.exports = printer;
