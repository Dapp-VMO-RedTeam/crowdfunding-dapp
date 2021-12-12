# Diều Xanh - Ứng dụng kêu gọi vốn quỹ cộng đồng 

Diều Xanh là một nền tảng ứng dụng gọi vốn cộng đồng  hay gây quỹ cộng đồng (crowfunding platform ) dựa trên công nghệ Blockchain để đảm bảo tính minh bạch và đáng tin cậy. Ý tưởng này đến từ việc hiện nay rất nhiều nơi có hoàn cảnh cần được giúp đỡ , đã có những người đại diện kêu gọi nhưng lại không mang tính minh bạch , quỹ đóng góp chủ yếu vì lòng tin từ người từ thiện vào người đại diện .

Không giới hạn mỗi việc hỗ trợ các tổ chức từ thiện mà các nhà khởi nghiệp tìm kiếm nguồn vốn từ cộng đồng, cũng có thể tham gia và kêu gọi nguồn hỗ trợ từ các nhà hảo tâm và cộng đồng quan tâm.

# Các tech stack sử dụng 
Web3 JS /n
Next JS /n
Chakra-ui /n
Solidity /n

# Deploy smart contract lên mạng Rinkeby 
Sử dụng Hardhat để deploy lên mạng thử nghiệm Rinkeby với Infura 
Chỉnh sửa file hardhat.cònig.js

```
module.exports = {
   defaultNetwork: "rinkeby",
   networks: {
     hardhat: {
       chainId: 1337
     },
     rinkeby: {
       url: 'https://rinkeby.infura.io/v3/<your secreat key>',
       accounts: [privateKey]
     }
   },
   solidity: {
     version: "0.8.0",
     settings: {
       optimizer: {
         enabled: true,
         runs: 200
       }
     }
   }
 }
```
```shell
npx hardhat run scripts/deploy.js --network rinkeby
```

# Deploy ứng dụng với Vercel 
Tìm hiểu thêm tại https://vercel.com/guides/deploying-nextjs-with-vercel
