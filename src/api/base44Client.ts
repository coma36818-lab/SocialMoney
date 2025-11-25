// This is a placeholder for the base44 client.
// In a real application, this would be a proper API client.

const mockPosts: any[] = [
    // ... mock data
];

const list = async (sort: string, limit: number) => {
    return mockPosts;
};

const update = async (id: string, data: any) => {
    const post = mockPosts.find(p => p.id === id);
    if (post) {
        Object.assign(post, data);
    }
    return post;
};

const create = async (data: any) => {
    const newPost = { id: `mock_${Date.now()}`, ...data };
    mockPosts.unshift(newPost);
    return newPost;
};

const UploadFile = async ({ file }: { file: File }) => {
    // This is a mock upload. In a real app, this would upload to a service.
    return { file_url: URL.createObjectURL(file) };
};


export const base44 = {
    entities: {
        Post: {
            list,
            update,
            create,
        }
    },
    integrations: {
        Core: {
            UploadFile,
        }
    }
};
