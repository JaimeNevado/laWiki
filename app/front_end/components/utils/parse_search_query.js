function ParseQuery({query}){
    const queryParams = Object.keys(query)
    .filter(key => query[key] !== '')
    .map(key => {
      const value = query[key];
      return `${key}=${encodeURIComponent(value)}`;      
    })
    .join('&');

  return queryParams;
}

export default ParseQuery;