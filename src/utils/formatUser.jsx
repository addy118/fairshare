export default function formatUser(user) {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    username: user.username,
    email:
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses[0]?.emailAddress,
    pfp: user.imageUrl,
  };
}
