import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';

let isRefreshing = false;
let failedRequestsQueue = []; //todas as requisições que deram falha por estar com o token expirado

export function setupApiClient(ctx = undefined) {
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
            Authorization: `Barer ${cookies['nextauth.token']}`
        } 
    });
    
    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if (error.response.status === 401) {
            if (error.response.data?.code === 'token.expired') {
                cookies = parseCookies(ctx);
    
                const { 'nextauth.refreshToken': refreshToken } = cookies;
                const originalConfig = error.config //é toda a config da requisição feita pro backend  
    
                if(!isRefreshing) {
                    isRefreshing = true 
                    //quando receber a primeira resposta com token inválido, 
                    //vai atualizar o token, As outras requisições n vão acontecer, pois o isRefreshing será TRUE.  
                    //só vai fazer a reqwuisição de refreshToken uma única vez independente de quantas chamadas api aconteceçam
                    //ao mesmo tempo enquanto o token ta válido
    
                    api.post('/refresh', {
                        refreshToken
                    }).then(response => {
                        const {token} = response.data;
        
                        setCookie(ctx, 'nextauth.token', token, {
                            maxAge: 60 * 60 * 24 * 30, // 30 dias
                            path: '/'
                        })
        
                        setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
                            maxAge: 60 * 60 * 24 * 30, // 30 dias
                            path: '/'
                        })
        
                        api.defaults.headers['Authorization'] = `Barer ${token}`;
    
                        failedRequestsQueue.forEach(request => request.onSuccess(token))
                        failedRequestsQueue = [];
                    }).catch(err => {
                        failedRequestsQueue.forEach(request => request.onFailure(err))
                        failedRequestsQueue = [];
    
                        if (process.browser) {
                            signOut()
                        } else {
                            return Promise.reject(new AuthTokenError())
                        }
                    }).finally(() => {
                        isRefreshing = false
                    });
                }
                // n dá pra usar async com o interceptor
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({
                        onSuccess: (token: string) => {
                            originalConfig.headers['Authorization'] = `Barer ${token}`
    
                            resolve(api(originalConfig))
                        },
                        onFailure: (err: AxiosError) => {
                            reject(err)
                        }
                    })
                });
            } else {
                if (process.browser) {
                    signOut()
                }
            }
        }
    
        return Promise.reject(error);
    });
    return api
}
