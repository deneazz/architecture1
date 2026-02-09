const servers = [true, false, true, false, true, true, false];

function uptimePercent(servers){
  let leng = servers.length;
  let cnt = 0;
  for(let i=0; i<leng; i++){
    if (servers[i] === true){
      cnt++;
    }
  }
  return (cnt / leng) * 100;
}

console.log(Math.round(uptimePercent(servers)) + "%");
