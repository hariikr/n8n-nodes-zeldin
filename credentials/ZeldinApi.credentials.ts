import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ZeldinApi implements ICredentialType {
	name = 'zeldinApi';
	displayName = 'Zeldin API';
	documentationUrl = 'https://docs.zeldin.com/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Zeldin API Key',
		},
		{
			displayName: 'API URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.zeldin.com',
			description: 'The URL of your Zeldin gateway',
		},
	];
}