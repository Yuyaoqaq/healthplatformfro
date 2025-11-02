export function policy(_self) {
  return new Promise((resolve, reject) => {
    //请求服务端签名
    _self.axios.get('http://localhost:9000/oss/policy', {}).then((data) => {
      resolve(data);
    });
  })
}