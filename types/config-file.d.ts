export = index;
declare function index(filename: any, options: any): any;
declare namespace index {
  function global(moduleName: any, filename: any, opts?: any): any;
  const globalDir: string;
  function home(filename: any, opts?: any): any;
  function npm(moduleName: any, filename: any, opts?: any): any;
  function parse(filename: any, options: any): any;
  function resolve(filename: any, options: any): any;
}
