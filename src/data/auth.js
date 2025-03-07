let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

export const registerUser = (user) => {
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
};

export const loginUser = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return true;
    }
    return false;
};

export const logoutUser = () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
    return currentUser;
};