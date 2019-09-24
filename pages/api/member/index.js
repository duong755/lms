/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse<any[]>} res
 * @returns {void}
 */
export default (req, res) => {
    res.json([
        {
            id: '17020191',
            name: 'Ngo Quang Duong'
        },
        {
            id: '17020772',
            name: 'Nguyen Xuan Hoang'
        },
        {
            id: '17021017',
            name: 'Nguyen Tien Thanh'
        },
        {
            id: '17020731',
            name: 'Dinh The Hiep'
        },
        {
            id: '17020853',
            name: 'Le Thi Thuy Linh'
        },
        {
            id: '16021213',
            name: 'Nguyen Anh Tuan'
        }
    ]);
};
