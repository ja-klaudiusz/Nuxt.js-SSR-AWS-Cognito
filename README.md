# Instalation steps 
### 1. Create AWS account and go to the Cognito settings
### 2. Click Manage User Pools
![](https://github.com/ja-klaudiusz/Nuxt.js-SSR-AWS-Cognito/blob/master/assets/1.png)
### 3. Type pool name and click Step through settings
![](https://github.com/ja-klaudiusz/Nuxt.js-SSR-AWS-Cognito/blob/master/assets/2.png)
### 4. In attributes tab check the options as below and click next
![](https://github.com/ja-klaudiusz/Nuxt.js-SSR-AWS-Cognito/blob/master/assets/3.png)
### 5. In policies tab select as below
![](https://github.com/ja-klaudiusz/Nuxt.js-SSR-AWS-Cognito/blob/master/assets/4.png)
### 6. Next in MFA tab select as below
![](https://github.com/ja-klaudiusz/Nuxt.js-SSR-AWS-Cognito/blob/master/assets/5.png)
### 7. Then in App clients tab add an app client
![](https://github.com/ja-klaudiusz/Nuxt.js-SSR-AWS-Cognito/blob/master/assets/6.png)
### 8. Afterwards check as below
![](https://github.com/ja-klaudiusz/Nuxt.js-SSR-AWS-Cognito/blob/master/assets/7.png)
### 9. Next two steps you can skip and finally you will see some thing like this
![](https://github.com/ja-klaudiusz/Nuxt.js-SSR-AWS-Cognito/blob/master/assets/8.png)
### 10. Create .env file and save your Pool Id, App client id and Pool region
#### .env

    UserPoolId=eu-central-1_X6gk9q9wU
    ClientId=34awgjes6resft2q6w5dwry64
	  PoolRegion=eu-central-1
    
