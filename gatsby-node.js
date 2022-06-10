const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;

    if (node.internal.type === 'MarkdownRemark') {
        const slug = createFilePath({ node, getNode, basePath: `projects`, });
        const fpath = node.fileAbsolutePath.split('/src/projects/')[1];

        createNodeField({
            node,
            name: `slug`,
            value: `/projects/${fpath.substr(0, fpath.indexOf(slug.slice(1, -1)))}${slug.substr(1)}`,
        });
    }
};

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
    const result = await graphql(`
        {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `);

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
            path: node.fields.slug,
            component: path.resolve(__dirname, `src`, `templates`, `entry.tsx`),
            context: {
                slug: node.fields.slug,
            },
        });
    });
};