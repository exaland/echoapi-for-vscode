import express, { Request, Response } from 'express';
import * as vscode from 'vscode';
import { completeOpenApiData, getExportData, getProjectShareData, setApiDocsBaseUrl } from '../utils/share';
import { getApiList, getLocalIPv4 } from '../utils';
import { exportMethod } from '@/utils/export';
import { isEmpty, isPlainObject } from 'lodash';

const PORT_START = 3000; // Starting port
const MAX_PORT = 5000; // Maximum port limit

let server: any;
export const startDocsServer = (context: vscode.ExtensionContext, port = PORT_START,reStart = false) => {
	const app = express();
	let baseUrl = '';
	// Dynamically load Swagger docs and handle query parameters
	app.get('/api-docs', async (req: Request, res: Response) => {
		try {
			// Get query parameters
			const share_id = req?.query?.share_id as string; // Replace yourParam with your parameter name

			// Get share record (return error if not found)
			const shareData = getProjectShareData(context);
			if (!shareData?.[share_id]) {
				res.status(404).sendFile(__dirname + '/404.html');
				return 'error';
			}
			// Find latest API data through record and convert to swagger format.
			const apiList = getApiList(context);
			const shareApiData = apiList.find(i => i?.target_id === share_id);
			if (shareApiData === undefined) {
				res.status(404).sendFile(__dirname + '/404.html');
				return 'error';
			}

			res.send(getSwaggerHtml(baseUrl, share_id));
		} catch (error) {
		}
	});

	// Set a route to return Swagger JSON data
	app.get('/swagger.json', async (req: Request, res: Response) => {
		// Get query parameters
		const share_id = req?.query?.share_id as string;
		// Get share record (return error if not found)
		const shareData = getProjectShareData(context);
		if (!shareData?.[share_id]) {
			res.json({});
			return 'error';
		}
		// Find latest API data through record and convert to swagger format.
		const apiList = getApiList(context);
		const shareApiData = apiList.find(i => i?.target_id === share_id);
		if (shareApiData === undefined || !isPlainObject(shareApiData)) {
			res.json({});
			return 'error';
		}

		const json = getExportData({ apis: [shareApiData] }, context);

		// Prioritize using design data for display
		if (isPlainObject(shareApiData?.open_api) && !isEmpty(shareApiData.open_api)) {
			const openApi =  completeOpenApiData(shareApiData.open_api,context);
			res.json(openApi);
			return;
		}

		const swaggerRes = await exportMethod.apiToSwagger(json, '3.0');
		if (swaggerRes.status === 'success') {
			res.json(swaggerRes.data); 			// Return swagger.json data
		} else {
			res.json({});
		}
	});

	app.get('/doc.js', async (req: Request, res: Response) => {
		res.sendFile(__dirname + '/redoc.standalone.js');
	});

	app.get('/api-docs/images/logo_icon.png', async (req: Request, res: Response) => {
		res.sendFile(__dirname + '/images/logo_icon.png');
	});

	server = app.listen(port, () => {
		const ipv4 = getLocalIPv4();
		// Server started successfully (record the port number)
		setApiDocsBaseUrl(context, `http://${ipv4}:${port}/api-docs`, reStart);
		baseUrl = `http://${ipv4}:${port}`;
	});
	server.on('error', (err:any) => {
		if (port < MAX_PORT) {
			startDocsServer(context, port + 1, reStart); // Recursively try next port
		} else {
		}
	});
}

// Stop server
function stopServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err:any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve(); // If no server is running, resolve directly
    }
  });
}

// Example: stop server and restart
export const restartServer=async (context: vscode.ExtensionContext,newPort: number)=> {
  try {
    await stopServer(); // Stop current server
    startDocsServer(context,newPort, true); // Restart server
  } catch (err) {
  }
}

const getSwaggerHtml = (baseUrl: string, share_id: string) => {
	return `<!DOCTYPE html>
<html>
  <head>
    <title>EchoAPI For Vscode</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='${baseUrl}/swagger.json?share_id=${share_id}'></redoc>
    <script src="${baseUrl}/doc.js"> </script>
  </body>
</html>`
}
