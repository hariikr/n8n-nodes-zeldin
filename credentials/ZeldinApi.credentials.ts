import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ZeldinApi implements ICredentialType {
  name = 'zeldinApi';
  displayName = 'Zeldin API';

  properties: INodeProperties[] = [
    {
      displayName: 'Supabase Service Role Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      description: 'The "service_role" secret key from Supabase > Settings > API. This allows bypass of RLS.',
    },
    {
      displayName: 'Supabase Project URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://[project-ref].supabase.co',
      description: 'The Project URL from Supabase > Settings > API (Example: https://xyz.supabase.co)',
    },
  ];
}