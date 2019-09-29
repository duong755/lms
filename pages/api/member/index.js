import { member } from '../../../mock-data';

/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse<any[]>} res
 * @returns {void}
 */
export default (req, res) => {
  res.json(member);
};
