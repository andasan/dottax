import { NextApiRequest, NextApiResponse } from "next";
import { readFile, set_fs, utils } from 'xlsx';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

}

// export async function getStaticProps() {
//   /* read file */
//   set_fs(await import("fs"));
//   const wb = readFile(path_to_file)

//   /* generate and return the html from the first worksheet */
//   const html = utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);
//   return { props: { html } };
// };