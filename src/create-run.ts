import axios, { AxiosResponse } from 'axios'

const baseUrl = 'https://terraform.io/api/v2'



export async function getWorkspaceId(
    organization: string, 
    workspace: string
): Promise<string> {
   
   console.log("entering try")
   const url = "https://app.terraform.io/api/v2/organizations/self_hkr/workspaces/learn-terraform-github-actions"

   const headers = {
    Authorization: `Bearer ${process.env.api_token}`,
    'Content-Type': 'application/vnd.api+json',

   }
  
try{

     
    const response: AxiosResponse = await axios.get(
    //    'https://app.terraform.io/api/v2/organizations/self_hkr/workspaces/learn-terraform-github-actions',{
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

  
