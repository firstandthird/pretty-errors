const ERRORS = [
  {
    regexp: /apiQuery:error/gi,
    format: match => 'Api fails'
  },
  {
    regexp: /Response Error: 401 Unauthorized/gi,
    format: (match, service) => `We're having problems connecting to ${service}.`
  }
];

export default ERRORS;
