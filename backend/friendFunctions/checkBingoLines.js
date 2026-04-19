export const countBingoLines = (marked) => {

  let lines = 0;

  // check rows
  for(let i=0;i<5;i++){
    if(marked[i].every(v => v === 1)){
      lines++;
    }
  }

  // check columns
  for(let j=0;j<5;j++){

    let columnComplete = true;

    for(let i=0;i<5;i++){
      if(marked[i][j] !== 1){
        columnComplete = false;
        break;
      }
    }

    if(columnComplete) lines++;
  }

  // main diagonal
  let mainDiagonal = true;

  for(let i=0;i<5;i++){
    if(marked[i][i] !== 1){
      mainDiagonal = false;
      break;
    }
  }

  if(mainDiagonal) lines++;

  // anti diagonal
  let antiDiagonal = true;

  for(let i=0;i<5;i++){
    if(marked[i][4-i] !== 1){
      antiDiagonal = false;
      break;
    }
  }

  if(antiDiagonal) lines++;

  return lines;
};