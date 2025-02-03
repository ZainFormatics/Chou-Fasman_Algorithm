const parameters = {
    alpha: {
      A: 1.42, C: 0.70, D: 1.01, E: 1.51, F: 1.13, G: 0.57,
      H: 1.00, I: 1.08, K: 1.16, L: 1.21, M: 1.45, N: 0.67,
      P: 0.57, Q: 1.11, R: 0.98, S: 0.77, T: 0.83, V: 1.06,
      W: 1.08, Y: 0.69
    },
    beta: {
      A: 0.83, C: 1.19, D: 0.54, E: 0.37, F: 1.38, G: 0.75,
      H: 0.87, I: 1.60, K: 0.74, L: 1.30, M: 1.05, N: 0.89,
      P: 0.55, Q: 1.10, R: 0.93, S: 0.75, T: 1.19, V: 1.70,
      W: 1.37, Y: 1.47
    },
    turn: {
      A: 0.66, C: 1.19, D: 1.46, E: 0.74, F: 0.60, G: 1.56,
      H: 0.95, I: 0.47, K: 1.01, L: 0.59, M: 0.60, N: 1.56,
      P: 1.52, Q: 0.98, R: 0.95, S: 1.43, T: 0.96, V: 0.50,
      W: 0.96, Y: 1.14
    }
  };
  
  function predictSecondaryStructure(sequence) {
    const n = sequence.length;
    const structure = Array(n).fill('C'); 
    const alphaThreshold = 1.03;
    const betaThreshold = 1.00;
    const turnThreshold = 1.00;
  
    for (let i = 0; i <= n - 6; i++) {
      let alphaScore = 0;
      for (let j = 0; j < 6; j++) {
        alphaScore += parameters.alpha[sequence[i + j]] || 0;
      }
      if (alphaScore / 6 >= alphaThreshold) {
        for (let j = 0; j < 6; j++) {
          structure[i + j] = 'H';
        }
      }
    }
  
    for (let i = 0; i <= n - 5; i++) {
      let betaScore = 0;
      for (let j = 0; j < 5; j++) {
        betaScore += parameters.beta[sequence[i + j]] || 0;
      }
      if (betaScore / 5 >= betaThreshold) {
        for (let j = 0; j < 5; j++) {
          if (structure[i + j] === 'C') { 
            structure[i + j] = 'E';
          }
        }
      }
    }
  
    for (let i = 0; i <= n - 4; i++) {
      let turnScore = 0;
      for (let j = 0; j < 4; j++) {
        turnScore += parameters.turn[sequence[i + j]] || 0;
      }
      if (turnScore / 4 >= turnThreshold) {
        for (let j = 0; j < 4; j++) {
          if (structure[i + j] === 'C') { 
            structure[i + j] = 'T';
          }
        }
      }
    }
  
    return structure.join('');
  }
  
  function formatOutput(sequence, predictedStructure) {
    const chunkSize = 60;
    let formattedOutput = '';
  
    for (let i = 0; i < sequence.length; i += chunkSize) {
      const sequenceChunk = sequence.slice(i, i + chunkSize);
      const structureChunk = predictedStructure.slice(i, i + chunkSize);
      const start = i + 1;
      const end = Math.min(i + chunkSize, sequence.length);
      formattedOutput += `Range ${start}-${end}:\n`;
      formattedOutput += `Sequence:  ${sequenceChunk.padEnd(chunkSize)}\n`;
      formattedOutput += `Structure: ${structureChunk.padEnd(chunkSize)}\n\n`;
    }
  
    return formattedOutput;
  }
  
  function runChouFasman() {
    const inputArea = document.getElementById('sequence1');
    const sequence = inputArea.value.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, '');
    
    if (!sequence) {
      alert('Please enter a valid protein sequence.');
      return;
    }
    
    const predictedStructure = predictSecondaryStructure(sequence);
    const formattedOutput = formatOutput(sequence, predictedStructure);
    
    document.getElementById('result').innerText = formattedOutput;
  }
  
  document.getElementById('copyButton')?.addEventListener('click', function() {
    const resultElement = document.getElementById('result');
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = resultElement.innerText;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    alert('Copied');
  });
  