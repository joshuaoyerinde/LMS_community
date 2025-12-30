
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class DbClient {
	private BASE_URL: string | undefined;
	public axios: AxiosInstance;

	/**
	 * Wraps the remote data_transaction HTTP API
	 */
	constructor() {
		this.BASE_URL = process.env.BASE_URL;
        console.log(this.BASE_URL)
		this.axios = axios.create({
			baseURL: this.BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}



