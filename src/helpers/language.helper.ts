export function textToSlug(text: string): string {
  const converter = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ь: '',
    ы: 'y',
    ъ: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };

  text = text.toLowerCase();

  let answer = '';
  for (let i = 0; i < text.length; ++i) {
    if (converter[text[i]] == undefined) {
      answer += text[i];
    } else {
      answer += converter[text[i]];
    }
  }

  answer = answer.replace(/[^-0-9a-z]/g, '-');
  answer = answer.replace(/[-]+/g, '-');
  answer = answer.replace(/^\-|-$/g, '');
  return answer;
}

export function dateInterval(date: number): string {
  const currentDate = Math.floor(Date.now() / 1000);
  const interval = currentDate - date;
  let value;
  if (interval < 60) {
    value = 'секунд';
    if (interval % 10 == 1) {
      return `${interval} ${value}а`;
    } else if (interval % 10 < 5) {
      return `${interval} ${value}ы`;
    } else {
      return `${interval} ${value}`;
    }
  } else if (interval < 3600) {
    value = 'минут';
    if (
      Math.floor(interval / 60) % 10 == 1 &&
      Math.floor(interval / 60) % 100 != 1
    ) {
      return `${Math.floor(interval / 60)} ${value}у`;
    } else if (Math.floor(interval / 60) % 10 < 5) {
      return `${Math.floor(interval / 60)} ${value}ы`;
    } else {
      return `${Math.floor(interval / 60)} ${value}`;
    }
  } else if (interval < 86400) {
    value = 'час';
    if (
      Math.floor(interval / 3600) % 10 == 1 &&
      Math.floor(interval / 3600) % 100 != 1
    ) {
      return `${Math.floor(interval / 3600)} ${value}`;
    } else if (
      Math.floor(interval / 3600) % 10 < 5 &&
      Math.floor(interval / 3600) % 100 != 1
    ) {
      return `${Math.floor(interval / 3600)} ${value}а`;
    } else {
      return `${Math.floor(interval / 3600)} ${value}ов`;
    }
  } else if (interval < 604800) {
    value = 'д';
    if (
      Math.floor(interval / 86400) % 10 == 1 &&
      Math.floor(interval / 86400) % 100 != 1
    ) {
      return `${Math.floor(interval / 86400)} ${value}ень`;
    } else if (
      Math.floor(interval / 86400) % 10 < 5 &&
      Math.floor(interval / 86400) % 100 != 1
    ) {
      return `${Math.floor(interval / 86400)} ${value}ня`;
    } else {
      return `${Math.floor(interval / 86400)} ${value}ней`;
    }
  } else if (interval < 2678400) {
    value = 'недел';
    if (
      Math.floor(interval / 604800) % 10 == 1 &&
      Math.floor(interval / 604800) % 100 != 1
    ) {
      return `${Math.floor(interval / 604800)} ${value}ень`;
    } else if (
      Math.floor(interval / 604800) % 10 < 5 &&
      Math.floor(interval / 604800) % 100 != 1
    ) {
      return `${Math.floor(interval / 604800)} ${value}ня`;
    } else {
      return `${Math.floor(interval / 604800)} ${value}ней`;
    }
  } else if (interval < 15768000) {
    value = 'месяц';
    if (
      Math.floor(interval / 2678400) % 10 == 1 &&
      Math.floor(interval / 2678400) % 100 != 1
    ) {
      return `${Math.floor(interval / 2678400)} ${value}`;
    } else if (
      Math.floor(interval / 2678400) % 10 < 5 &&
      Math.floor(interval / 2678400) % 100 != 1
    ) {
      return `${Math.floor(interval / 2678400)} ${value}а`;
    } else {
      return `${Math.floor(interval / 2678400)} ${value}ев`;
    }
  } else if (interval < 31536000) {
    return 'Полгода';
  } else if (interval >= 31536000 && Math.floor(interval / 31536000) % 10 < 5) {
    value = 'год';

    if (
      Math.floor(interval / 31536000) % 10 == 1 &&
      Math.floor(interval / 31536000) % 100 != 1
    ) {
      return `${Math.floor(interval / 31536000)} ${value}`;
    } else {
      return `${Math.floor(interval / 31536000)} ${value}а`;
    }
  } else {
    return `${Math.floor(interval / 31536000)} лет`;
  }
}

export function isUUID(string: string): boolean {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(string);
}
