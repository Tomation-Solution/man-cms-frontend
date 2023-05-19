export const getGroupedBy = (arrObj: any, key: string) => {
  let groups: any = {};
  let result: any = [];
  arrObj.forEach((a: any) => {
    if (!(a[key] in groups)) {
      groups[a[key]] = [];
      result.push(groups[a[key]]);
    }
    groups[a[key]].push(a);
  });
  return result;
};
