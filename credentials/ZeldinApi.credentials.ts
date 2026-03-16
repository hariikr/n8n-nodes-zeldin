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
  ];
}