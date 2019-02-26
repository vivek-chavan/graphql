const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient({region : 'eu-west-1'});
const data = {
  getDate(args) {
    var params = {
		TableName: 'delete_this',
		Key: {
		"id": args.id
		}
	};
	
	return client.get(params).promise().then(result => {
		console.log(result)
		// return result
      return {
        'id':args.id,'transaction_date':result.Item.transaction_date
      }
    })
  },
  getModelDetails(args) {
    var params = {
		TableName: 'delete_this',
		Key: {
		"id": args.id
		}
	};
	
	return client.get(params).promise().then(result => {
		console.log(result)
      return {
        'id':args.id,'imei':result.Item.imei,'make':result.Item.make,'model':result.Item.model
      }
    })
  }
}; 

const resolvers = {
  Query: {
    getDate: (root, args) => data.getDate(args),
    getModelDetails: (root, args) => data.getModelDetails(args)
  },
};

module.exports = resolvers
// exports.default = resolvers;