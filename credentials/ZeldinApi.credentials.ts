import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ZeldinApi implements ICredentialType {
  name = 'zeldinApi';
  displayName = 'Zeldin API';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.zeldin.com',
      description: 'The base URL of the Zeldin API',
    },
  ];
}