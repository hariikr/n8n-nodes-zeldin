import {
	IHookFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class ZeldinTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zeldin Trigger',
		name: 'zeldinTrigger',
		icon: 'file:zeldin.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle Zeldin events via webhooks',
		defaults: {
			name: 'Zeldin Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'zeldinApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Entity Created',
						value: 'entity.created',
					},
					{
						name: 'Entity Deleted',
						value: 'entity.deleted',
					},
					{
						name: 'Entity Updated',
						value: 'entity.updated',
					},
				],
				default: 'entity.created',
				required: true,
			},
			{
				displayName: 'Entity Type',
				name: 'entity',
				type: 'options',
				options: [
					{ name: 'Any', value: 'any' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Deal', value: 'deal' },
					{ name: 'Inquiry', value: 'inquiry' },
					{ name: 'Property', value: 'property' },
				],
				default: 'any',
				description: 'Filter by entity type',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// We don't have a specific way to check if a webhook exists yet,
				// so we return false to ensure 'create' is called during activation.
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const entity = this.getNodeParameter('entity') as string;
				const credentials = await this.getCredentials('zeldinApi');

				const body = {
					event,
					entity,
					url: webhookUrl,
				};

				const options: any = {
					method: 'POST',
					uri: `https://api.zeldin.com/webhooks`,
					headers: {
						Authorization: `Bearer ${credentials.apiKey}`,
					},
					body,
					json: true,
				};

				const responseData = await this.helpers.request(options);
				const webhookData = this.getWorkflowStaticData('node') as any;
				webhookData.webhookId = responseData.id;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node') as any;
				const credentials = await this.getCredentials('zeldinApi');

				if (webhookData.webhookId) {
					const options: any = {
						method: 'DELETE',
						uri: `https://api.zeldin.com/webhooks/${webhookData.webhookId}`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					try {
						await this.helpers.request(options);
						delete webhookData.webhookId;
					} catch (error) {
						return false;
					}
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		const eventType = this.getNodeParameter('event') as string;
		const entityType = this.getNodeParameter('entity') as string;

		// Filter events based on node configuration
		if (body.event !== eventType) {
			return {
				workflowData: [],
			};
		}

		if (entityType !== 'any' && body.entity !== entityType) {
			return {
				workflowData: [],
			};
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray(body),
			],
		};
	}
}
