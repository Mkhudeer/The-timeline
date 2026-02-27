const homePage = (req, res) => {

  const posts = [
    {
      name: "Michael Choi",
      createdAt: "15-01-2013",
      message: "This is my message This is my message This is my message This This is my message This is my message This  This is my message This is my message This is my messageThis is my messageis my messageThis is my messageis my messageThis is my message This is my message This is my message This is my message"
    },
    {
      name: "Michael Choi",
      createdAt: "23-01-2013",
      message: "This is my message This is my message This is my message This This is my message This is my message This  This is my message This is my message This is my messageThis is my messageis my messageThis is my messageis my messageThis is my message This is my message This is my message This is my message"
    },
    {
      name: "Cory Whiteland",
      createdAt: "15-01-2013",
      message: "This is my message This is my message This is my message This This is my message This is my message This  This is my message This is my message This is my messageThis is my messageis my messageThis is my messageis my messageThis is my message This is my message This is my message This is my message"
    },
    {
      name: "Cory Whiteland",
      createdAt: "01-01-2013",
      message: "This is my message This is my message This is my message This This is my message This is my message This  This is my message This is my message This is my messageThis is my messageis my messageThis is my messageis my messageThis is my message This is my message This is my message This is my message"
    }
  ];

  res.render("homePage", { posts });

};

module.exports = { homePage };