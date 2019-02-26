const { graphql } = require('graphql');
// var schema = require('./schema.js');
// var resolvers = require('./resolver.js')
var makeExecutableSchema = require('graphql-tools').makeExecutableSchema
const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

exports.handler = (event, context, callback) => {
  // let query = event.query;
  // if (event.query && event.query.hasOwnProperty('query')) {
  //   query = event.query.query.replace("\n", ' ', "g");
  // }
  // console.log(query)
  var inputData = event.input
  var queryType = inputData.queryType;
  var id = inputData.id.toString();
  // {
  //         'id': args.id,
  //         'imei': result.Item.imei,
  //         'make': result.Item.make,
  //         'model': result.Item.model
  //       }
  var expectedOutputArray = inputData.paramsToFetch;
  var paramsToFetch = '{'
  var paramToFetchForResolver = {}
  expectedOutputArray.forEach(function(element) {
    paramsToFetch = paramsToFetch + "\r\n" + element
  });
  paramsToFetch = paramsToFetch + '\r\n}'

  let query = "query " + queryType + " {\r\n" + queryType + "(id:\"" + id + "\")" + paramsToFetch + "\r\n}"

  // query = /*event.query.*/query.replace("\r\n", ' ', "g");
  // return callback(null,constructQuery)
  const schema = `
    type Query {
      getDate(id: String): Date!
      getModelDetails(id: String): ModelDetails!
    }
    type Date {
      id: String
      transaction_date: String
    }
    type ModelDetails {
      id: String
      imei: String
      make: String
      model: String
    }
    type Mutation {
        enterModel(id: String!, imei: String!, make: String!, model: String!, transaction_date: String!): ModelDetails
    }
    schema {
        query: Query
        mutation: Mutation
    }`;

  const AWS = require('aws-sdk');
  const client = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });
  const data = {
    getDataFromDynamo(args) {
      var params = {
        TableName: 'delete_this',
        Key: {
          "id": args.id
        }
      };

      return client.get(params).promise().then(result => {
        // console.log(Object.keys(result).length)
        // console.log(result)
        if (Object.keys(result).length === 0) {
          return {
            "id": "NA"
          }
        }
        // console.log(Object.keys(result).length)
        expectedOutputArray.forEach(function(element) {
          if (result.Item[element] == undefined)
            paramToFetchForResolver[element] = "NA"
          else
            paramToFetchForResolver[element] = result.Item[element] + ''
        });
        console.log(paramToFetchForResolver)
        return paramToFetchForResolver
      })
    },
    // getModelDetails(args) {
    //   var params = {
    //     TableName: 'delete_this',
    //     Key: {
    //       "id": args.id
    //     }
    //   };

    //   return client.get(params).promise().then(result => {
    //     console.log(result)

    //     expectedOutputArray.forEach(function(element) {
    //       paramToFetchForResolver[element] = result.Item[element]
    //     });
    //     console.log(paramToFetchForResolver)
    //     return paramToFetchForResolver

    //   })
    // }
  };

  const resolvers = {
    Query: {
      getDate: (root, args) => data.getDataFromDynamo(args),
      getModelDetails: (root, args) => data.getDataFromDynamo(args)
    },
  };



  const myGraphQLSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers,
  });
  // console.log(myGraphQLSchema)

  // graphql(myGraphQLSchema, query).then(function(err, result) {
  //   if (err) {
  //     console.log('error occured in if err ' + err)
  //     console.log(err)
  //     callback(null, err.data[queryType])
  //   }
  //   console.log('RESULT: ', result);
  //   console.log('called graphql')
  //   callback(null, result)
  // }).catch((error) => {
  //   console.log('error occured in catch')
  //   console.log(error)
  // });
  graphql(myGraphQLSchema, query).then(result => callback(null, result.data[queryType]),

    err => callback(err)
  );
};
