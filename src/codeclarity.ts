/**
 * Waits for a number of milliseconds.
 *
 * @param email Email of the user that trigers the analysis.
 * @param password Password of the user that trigers the analysis.
 * @param domain Domain where CodeClarity's instance is located.
 * @returns Resolves with 'done!' after the wait is over.
 */
export async function authenticate(
  email: string,
  password: string,
  domain: string
): Promise<string> {
  return new Promise((resolve) => {
    // Perform an HTTP POST request using fetch
    const requestBody = {
      email: email,
      password: password
    }

    interface responseBody {
      data: {
        token: string
      }
    }

    fetch(`https://${domain}/api/auth/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the received data, e.g., save to auth_tokens.json
        resolve((data as responseBody).data.token)
      })
      .catch((error) => {
        console.error('Error during authentication:', error)
        // rejects(new Error('Failed to authenticate'))
      })
  })
}

/**
 * Waits for a number of milliseconds.
 *
 * @param token User's token.
 * @param domain Domain where CodeClarity's instance is located.
 * @returns Resolves with 'done!' after the wait is over.
 */
export async function getUser(token: string, domain: string): Promise<string> {
  return new Promise((resolve) => {
    interface responseBody {
      data: {
        id: string
      }
    }

    fetch(`https://${domain}/api/auth/user`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the received data, e.g., save to auth_tokens.json
        resolve((data as responseBody).data.id)
      })
      .catch((error) => {
        console.error('Error during authentication:', error)
        // rejects(new Error('Failed to authenticate'))
      })
  })
}

/**
 * Waits for a number of milliseconds.
 *
 * @param token User's token.
 * @param domain Domain where CodeClarity's instance is located.
 * @returns Resolves with 'done!' after the wait is over.
 */
export async function getOrganization(
  token: string,
  domain: string
): Promise<string> {
  return new Promise((resolve) => {
    interface Organization {
      organization: {
        id: string
      }
    }

    interface responseBody {
      data: Array<Organization>
    }

    fetch(`https://${domain}/api/org`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the received data, e.g., save to auth_tokens.json
        resolve((data as responseBody).data[0].organization.id)
      })
      .catch((error) => {
        console.error('Error during authentication:', error)
        // rejects(new Error('Failed to authenticate'))
      })
  })
}

/**
 * Waits for a number of milliseconds.
 *
 * @param token User's token.
 * @param organizationId Organization's ID.
 * @param projectName Project to analyze name.
 * @param domain Domain where CodeClarity's instance is located.
 * @returns Resolves with 'done!' after the wait is over.
 */
export async function getProject(
  token: string,
  organizationId: string,
  projectName: string,
  domain: string
): Promise<string> {
  return new Promise((resolve) => {
    interface Project {
      id: string
    }

    interface responseBody {
      data: Array<Project>
    }

    fetch(
      `https://${domain}/api/org/${organizationId}/projects?search_key=${projectName}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle the received data, e.g., save to auth_tokens.json
        try {
          resolve((data as responseBody).data[0].id)
        } catch {
          resolve('')
        }
      })
      .catch((error) => {
        console.error('Error during authentication:', error)
        // rejects(new Error('Failed to authenticate'))
      })
  })
}

/**
 * Waits for a number of milliseconds.
 *
 * @param token User's token.
 * @param organizationId Organization's ID.
 * @param analyzerName Project to analyze name.
 * @param domain Domain where CodeClarity's instance is located.
 * @returns Resolves with 'done!' after the wait is over.
 */
export async function getAnalyzer(
  token: string,
  organizationId: string,
  analyzerName: string,
  domain: string
): Promise<string> {
  return new Promise((resolve) => {
    interface responseBody {
      data: {
        id: string
      }
    }

    fetch(
      `https://${domain}/api/org/${organizationId}/analyzers/name?analyzer_name=${analyzerName}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle the received data, e.g., save to auth_tokens.json
        resolve((data as responseBody).data.id)
      })
      .catch((error) => {
        console.error('Error during authentication:', error)
        // rejects(new Error('Failed to authenticate'))
      })
  })
}

/**
 * Waits for a number of milliseconds.
 *
 * @param token User's token.
 * @param organizationId Organization's ID.
 * @param domain Domain where CodeClarity's instance is located.
 * @returns Resolves with 'done!' after the wait is over.
 */
export async function getGithuIntegration(
  token: string,
  organizationId: string,
  domain: string
): Promise<string> {
  return new Promise((resolve) => {
    interface Integration {
      id: string
      integration_type: string
      integration_provider: string
    }

    interface responseBody {
      data: Array<Integration>
    }

    fetch(`https://${domain}/api/org/${organizationId}/integrations/vcs`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the received data, e.g., save to auth_tokens.json
        for (const integration of (data as responseBody).data) {
          if (integration.integration_provider == 'GITHUB') {
            resolve(integration.id)
            break
          }
        }
      })
      .catch((error) => {
        console.error('Error during authentication:', error)
        // rejects(new Error('Failed to authenticate'))
      })
  })
}

export interface vulnerabilityReponseBody {
  data: {
    number_of_critical: number
    number_of_high: number
    number_of_medium: number
    number_of_low: number
    number_of_none: number
  }
  status_code: number
}

/**
 * Waits for a number of milliseconds.
 *
 * @param token User's token.
 * @param organizationId Organization's ID.
 * @param projectId Project's ID.
 * @param analysisId Analysis' ID.
 * @param domain Domain where CodeClarity's instance is located.
 * @returns Resolves with 'done!' after the wait is over.
 */
export async function getResult(
  token: string,
  organizationId: string,
  projectId: string,
  analysisId: string,
  domain: string
): Promise<vulnerabilityReponseBody> {
  return new Promise((resolve) => {
    fetch(
      `https://${domain}/api/org/${organizationId}/projects/${projectId}/analysis/${analysisId}/vulnerabilities/stats?workspace=.`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle the received data, e.g., save to auth_tokens.json
        resolve(data as vulnerabilityReponseBody)
      })
      .catch((error) => {
        console.error('Error during authentication:', error)
        // rejects(new Error('Failed to authenticate'))
      })
  })
}

/**
 * Waits for a number of milliseconds.
 *
 * @param token User's token.
 * @param domain Domain where CodeClarity's instance is located.
 * @param organizationID Organization ID.
 * @param integrationID Integration ID.
 * @returns Resolves with 'done!' after the wait is over.
 */
export async function importProject(
  token: string,
  domain: string,
  organizationID: string,
  integrationID: string,
  projectName: string
): Promise<string> {
  return new Promise((resolve) => {
    // Perform an HTTP POST request using fetch
    const requestBody = {
      integration_id: integrationID,
      url: 'https://github.com/' + projectName,
      name: projectName,
      description: 'Imported by Github Action'
    }

    interface responseBody {
      id: string
      status_message: string
    }

    fetch(`https://${domain}/api/org/${organizationID}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the received data, e.g., save to auth_tokens.json
        resolve((data as responseBody).id)
      })
      .catch((error) => {
        console.error('Error during authentication:', error)
        // rejects(new Error('Failed to authenticate'))
      })
  })
}

/**
 * Waits for a number of milliseconds.
 *
 * @param token User's token.
 * @param domain Domain where CodeClarity's instance is located.
 * @param organizationID Organization ID.
 * @param projectID Project ID.
 * @param analyzerID Analyzer ID.
 * @param branchName Branch to analyze.
 * @returns Resolves with 'done!' after the wait is over.
 */
export async function startAnalysis(
  token: string,
  domain: string,
  organizationID: string,
  projectID: string,
  analyzerID: string,
  branchName: string
): Promise<string> {
  return new Promise((resolve) => {
    // Perform an HTTP POST request using fetch
    const requestBody = {
      analyzer_id: analyzerID,
      branch: branchName,
      config: {
        'js-sbom': {
          branch: branchName,
          project: `${organizationID}/projects/${projectID}/${branchName}`
        },
        'js-license': {
          licensePolicy: ['']
        }
      }
    }

    interface responseBody {
      id: string
    }

    fetch(
      `https://${domain}/api/org/${organizationID}/projects/${projectID}/analyses`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle the received data, e.g., save to auth_tokens.json
        resolve((data as responseBody).id)
      })
      .catch((error) => {
        console.error('Error during authentication:', error)
        // rejects(new Error('Failed to authenticate'))
      })
  })
}
