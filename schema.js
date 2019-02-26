const schema = `
type Query {
  getDate(id: String!): Date!
  getModelDetails(id: String!): ModelDetails!
}
type Date {
  id: String!
  transaction_date: String!
}
type ModelDetails {
  id: String!
  imei: String!
  make: String!
  model: String!
}
type Mutation {
    enterModel(id: String!, imei: String!, make: String!, model: String!, transaction_date: String!): ModelDetails
}
schema {
    query: Query
    mutation: Mutation
}`;
module.exports = schema
// exports.default = schema;