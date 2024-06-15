export function translateModality(data) {
  return data.map((item) => {
    let translatedModality = item.modality;
    let translatedTypeModality = item.typeModality;

    if (item.typeModality === 'U' || item.typeModality === 'U2') {
      if (item.modality === 'KT') {
        translatedModality = `КТ${item.typeModality === 'U' ? 'У' : 'У2'}`;
      } else if (item.modality === 'MRT') {
        translatedModality = `МРТ${item.typeModality === 'U' ? 'У' : 'У2'}`;
      }
      translatedTypeModality = item.typeModality === 'U' ? 'У' : 'У2';
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
      typeModality: translatedTypeModality,
      defaultModality: item.modality,
      defaultTypeModality: item.typeModality,
    };
  });
}
