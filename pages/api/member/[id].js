import { member } from '../../../mock-data';
/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse<any>} res
 * @returns {void}
 */
export default (req, res) => {
  const result = member.find(currentMember => currentMember.id === req.query.id);
  if (result) {
    res.json(result);
    return;
  }
  res.end('Member Not Found');
};
