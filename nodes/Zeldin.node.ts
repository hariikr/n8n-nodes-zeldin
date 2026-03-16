import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class Zeldin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zeldin',
		name: 'zeldin',
		icon: 'file:zeldin.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with Zeldin API',
		defaults: {
			name: 'Zeldin',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'zeldinApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Entity',
						value: 'entity',
					},
				],
				default: 'entity',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['entity'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new entity',
						action: 'Create an entity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an entity',
						action: 'Delete an entity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an entity',
						action: 'Get an entity',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an entity',
						action: 'Update an entity',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Entity Type',
				name: 'entity',
				type: 'options',
				options: [
					{ name: 'Contact', value: 'contact' },
					{ name: 'Deal', value: 'deal' },
					{ name: 'Inquiry', value: 'inquiry' },
					{ name: 'Property', value: 'property' },
				],
				default: 'property',
				description: 'The type of entity to operate on',
			},
			{
				displayName: 'Entity ID',
				name: 'entityId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
			},
			{
				displayName: 'Data (JSON)',
				name: 'data',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				default: '{}',
				description: 'The data to send in the request body',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const entity = this.getNodeParameter('entity', i) as string;
				const credentials = await this.getCredentials('zeldinApi');
				const apiKey = credentials?.apiKey as string;
				const baseUrl = (credentials?.baseUrl as string || 'https://api.zeldin.com').replace(/\/$/, '');

				let responseData;
				const options: any = {
					headers: {
						Authorization: `Bearer ${apiKey}`,
					},
					json: true,
				};

				if (resource === 'entity') {
					if (operation === 'create') {
						const data = this.getNodeParameter('data', i) as string;
						options.method = 'POST';
						options.uri = `${baseUrl}/entities/${entity}`;
						options.body = typeof data === 'string' ? JSON.parse(data) : data;
					} else if (operation === 'get') {
						const entityId = this.getNodeParameter('entityId', i) as string;
						options.method = 'GET';
						options.uri = `${baseUrl}/entities/${entity}/${entityId}`;
					} else if (operation === 'update') {
						const entityId = this.getNodeParameter('entityId', i) as string;
						const data = this.getNodeParameter('data', i) as string;
						options.method = 'PATCH';
						options.uri = `${baseUrl}/entities/${entity}/${entityId}`;
						options.body = typeof data === 'string' ? JSON.parse(data) : data;
					} else if (operation === 'delete') {
						const entityId = this.getNodeParameter('entityId', i) as string;
						options.method = 'DELETE';
						options.uri = `${baseUrl}/entities/${entity}/${entityId}`;
					}
				}

				responseData = await this.helpers.request(options);

				const executionData = this.helpers.returnJsonArray(responseData as any);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}