import {
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
		description: 'Handle Zeldin events from Supabase Webhooks',
		defaults: {
			name: 'Zeldin Trigger',
		},
		inputs: [],
		outputs: ['main'],
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
				displayName: 'Table Name',
				name: 'table',
				type: 'options',
				options: [
					{ name: 'Properties', value: 'properties' },
					{ name: 'Contacts', value: 'contacts' },
					{ name: 'Inquiries', value: 'inquiries' },
					{ name: 'Deals', value: 'deals' },
				],
				default: 'properties',
				description: 'The Supabase table that will trigger this node',
			},
			{
				displayName: 'Event Type',
				name: 'event',
				type: 'options',
				options: [
					{ name: 'All Events', value: 'all' },
					{ name: 'Insert', value: 'INSERT' },
					{ name: 'Update', value: 'UPDATE' },
					{ name: 'Delete', value: 'DELETE' },
				],
				default: 'all',
				description: 'The type of database event to trigger on',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		const table = this.getNodeParameter('table') as string;
		const eventType = this.getNodeParameter('event') as string;

		// Supabase Webhook payload structure: { table: "properties", type: "INSERT", ... }
		
		// 1. Check Table
		if (body.table !== table) {
			return { workflowData: [] };
		}

		// 2. Check Event Type
		if (eventType !== 'all' && body.type !== eventType) {
			return { workflowData: [] };
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray(body),
			],
		};
	}
}
