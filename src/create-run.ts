import axios, { AxiosResponse } from 'axios'

const baseUrl = 'https://app.terraform.io/api/v2'    






export async function getWorkspaceId(
    organization: string, 
    workspace: string
): Promise<string> {
    
    const endpoint = `organizations/${organization}/workspaces/${workspace}`
    const url = `${baseUrl}/${endpoint}`
    
    const headers = {
        Authorization: `Bearer ${process.env.api_token}`,
        'Content-Type': 'application/vnd.api+json',
    
       }
   
   //const url = "https://app.terraform.io/api/v2/organizations/self_hkr/workspaces/learn-terraform-github-actions"


  
try{

    console.log("entering try"+url)  
    const response: AxiosResponse<{data?: {id: string}}> = await axios.get(
    //    'https://app.terraform.io/api/v2/organizations/self_hkr/workspaces/learn-terraform-github-actions',
        url,
       { headers }
        
        
    );
    
    console.log("after request")
    const workspaceId = response?.data?.data?.id
    if (!workspaceId) {
        throw new Error('Failed to retrieve the workspace ID')
    }
    return workspaceId  

    }catch (error) {
        console.error(error);
        throw error;
      }
}

  
