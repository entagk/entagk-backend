const jwt = require("jsonwebtoken");

const validNumber = (number, min, max) => {
  return number <= max && number >= min ? true : false;
}

const validAudioType = (audio) => {
  return (audio?.name !== 'none' && (!audio?.name || !audio?.src)) ? false : true;
}

const validateEmail = (email) => {
  const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  return re.test(email);
}

const filterBody = (props, body) => {
  const keys = Object.entries(body).filter(([k, v]) => props.includes(k));

  return Object.fromEntries(keys);
}

const createObjFromObj = (obj, props) => {
  const result = Object.entries(obj).filter(([key, value]) => props.includes(key)).reduce((newObj, prop) => ({ ...newObj, [prop[0]]: prop[1] }), {});

  return result;
}

const createAcessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
};

const createPasswordResetPassword = (payload) => {
  return jwt.sign(payload, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });
}

const createRefrishToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" })
}

const validateDate = (dayValue) => {
  const [year, month, day] = dayValue?.split('-');
  if (!year || year.length < 4) return 'invalid year';
  else if (!month || month.length < 2 || Number(month) > 12 || Number(month) < 0) return 'invalid month';
  else if (!day || day.length < 2 || Number(day) > 31 || Number(day) < 0) return 'invalid day';
  else return '';
}

const validateNoteContent = (content) => {
  const types = [
    "heading-one",
    "heading-two",
    "block-quote",
    "bulleted-list",
    "numbered-list",
    "list-item",
    "link",
    "paragraph"
  ];

  const styles = [
    "bold",
    "code",
    "italic",
    "underline",
    "subscript",
    "superscript",
    "strikethrough",
  ]

  const validateChildren = (children) => {
    for (const text of children) {
      if (text.type !== 'link') {
        const textStyles = Object.keys(text).filter(s => s !== 'text');
        if (!textStyles.every(sty => styles.includes(sty)))
          return { validContent: false, textLength, invalidChildren: true };
        textLength += text.text?.trim()?.length;
      } else {
        const validLink = validateChildren(text.children);
        textLength += validLink.textLength;
      }
    };
  }

  if (content.length === 0)
    return { validContent: false, textLength: 0 };

  let textLength = 0;
  if (!content instanceof Array) {
    return { validContent: false, textLength: 0 };
  } else {
    for (const row of content) {
      if (!types.includes(row.type) || !row.children) {
        return { validContent: false, textLength, invalidType: true };
      }

      if (row.children.length === 0) {
        return { validContent: false, textLength, invalidChildren: true };
      }

      if (row.type === "numbered-list" || row.type === "bulleted-list") {
        const validList = validateNoteContent(row.children);
        if (!validList.validContent)
          return { validContent: false, textLength, invalidChildren: true };
        else textLength += validList.textLength;
      } else {
        for (const text of row.children) {
          if (text.type !== 'link') {
            const textStyles = Object.keys(text).filter(s => s !== 'text');
            if (!textStyles.every(sty => styles.includes(sty)))
              return { validContent: false, textLength, invalidChildren: true };
            textLength += text.text?.trim()?.length;
          } else {
            textLength += text.children[0].text?.trim()?.length;
          }
        };
      }
    }
  }

  return { validContent: true, textLength };
}

module.exports = {
  validNumber,
  validAudioType,
  validateEmail,
  filterBody,
  createObjFromObj,
  createAcessToken,
  createPasswordResetPassword,
  createRefrishToken,
  validateDate,
  validateNoteContent
};
