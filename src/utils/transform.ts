export function translateModality(data) {
  return data.map((item) => {
    let translatedModality = item.modality;

    if (item.typeModality === 'U' || item.typeModality === 'U2') {
      if (item.modality === 'KT') {
        translatedModality = `КТ${item.typeModality}`;
      } else if (item.modality === 'MRT') {
        translatedModality = `МРТ${item.typeModality}`;
      }
    } else {
      switch (item.modality) {
        case 'MRT':
          translatedModality = 'МРТ';
          break;
        case 'KT':
          translatedModality = 'КТ';
          break;
        case 'RG':
          translatedModality = 'РГ';
          break;
        case 'DENSITOMETER':
          translatedModality = 'Денситометр';
          break;
        case 'FLG':
          translatedModality = 'ФЛГ';
          break;
        case 'MMG':
          translatedModality = 'ММГ';
          break;
        default:
          break;
      }
    }

    return {
      ...item,
      modality: translatedModality,
    };
  });
}
