// Initialize Supabase
const supabaseUrl = 'https://your-project-id.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'your-anon-key'; // Replace with your Supabase anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM elements
const authContainer = document.getElementById('auth-container');
const feedContainer = document.getElementById('feed-container');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const postInput = document.getElementById('post-input');
const createPostButton = document.getElementById('create-post');
const postFeed = document.getElementById('post-feed');

// Authentication functions
async function signUp(email, password) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('Registration successful! Please check your email.');
  }
}

async function signIn(email, password) {
  const { user, error } = await supabase.auth.signIn({
    email,
    password
  });
  if (error) {
    alert('Error: ' + error.message);
  } else {
    loadFeed();
    authContainer.style.display = 'none';
    feedContainer.style.display = 'block';
  }
}

// Create post
async function createPost(content) {
  const { user } = supabase.auth.session();
  if (!user) return;

  const { data, error } = await supabase
    .from('posts')
    .insert([{ user_id: user.id, content }]);

  if (error) {
    alert('Error creating post: ' + error.message);
  } else {
    loadFeed();
  }
}

// Load posts into the feed
async function loadFeed() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, content, user_id, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    alert('Error loading feed: ' + error.message);
  } else {
    postFeed.innerHTML = '';
    data.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.innerHTML = `<strong>User ${post.user_id}</strong><p>${post.content}</p><small>${new Date(post.created_at).toLocaleString()}</small>`;
      postFeed.appendChild(postDiv);
    });
  }
}

// Event Listeners
loginButton.addEventListener('click', () => {
  const email = prompt('Enter your email');
  const password = prompt('Enter your password');
  signIn(email, password);
});

registerButton.addEventListener('click', () => {
  const email = prompt('Enter your email');
  const password = prompt('Enter your password');
  signUp(email, password);
});

createPostButton.addEventListener('click', () => {
  const content = postInput.value;
  if (content) {
    createPost(content);
    postInput.value = ''; // Clear the input
  } else {
    alert('Please enter some text to post');
  }
});

// Check if the user is logged in
const session = supabase.auth.session();
if (session) {
  loadFeed();
  authContainer.style.display = 'none';
  feedContainer.style.display = 'block';
}
