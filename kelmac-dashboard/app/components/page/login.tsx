import React from 'react'

function LoginComponent() {
  return (
      <div className="newloginbg">
   <div className="login-section">
  <div className="container">
    <div
      className="row  align-items-center justify-content-around"
      style={{ height: "100vh" }}
    >
      <div className="col-lg-4 col-md-6 col-sm-12">
        <div className="login-card">
          <div className="loginlogo mb-3">
            <a href="#">
              <img src="assets/img/logo.png" alt="" />
            </a>
          </div>
          <form action="" autoComplete="off" className="row p-4 pt-0">
            <div className="col-md-12">
              <label htmlFor="#" className="form-label">
                Username/Email
              </label>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text rounded-1"
                    id="basic-addon1"
                  >
                    <i className="fas fa-circle-user m-1" />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control rounded-1"
                  placeholder=""
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
            <div className="col-md-12">
              <label htmlFor="#" className="form-label">
                Password
              </label>
              <div className="form-group mb-3">
                <div className="input-group" id="show_hide_password">
                  <div className="input-group-prepend ">
                    <span
                      className="input-group-text rounded-1"
                      id="basic-addon2"
                    >
                      <i className="fa fa-lock m-1" />
                    </span>
                  </div>
                  <input
                    className="form-control border-end-0"
                    type="password"
                  />
                  <div className="input-group-text border-end border-start-0 ">
                    <a href="">
                      <i className="fa fa-eye-slash" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <label htmlFor="#" className="form-label">
                Agency Code
              </label>
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text rounded-1"
                    id="basic-addon1"
                  >
                    <i className="fa fa-shield-halved m-1" />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control rounded-1"
                  placeholder=""
                />
              </div>
            </div>
            <div className="col-md-12 mb-3">
              <div className="text-end">
                <a href="#" className="fs-6">
                  Forget Password
                </a>
              </div>
            </div>
            <div className="col-md-12">
              <div className="d-grid mb-3">
                <a
                  href="index.html"
                  type="button"
                  id="sendlogin"
                  className="btn btn-dark rounded-1"
                >
                  Login
                </a>
              </div>
            </div>
            <div className="col-md-12">
              <div className="sinuptext text-center">
                <p className="mb-1">
                  Don’t have a Account? <a href="#">Sign Up</a>
                </p>
                <p className="fw-light">
                  By logging in, you agree to our
                  <br />{" "}
                  <a href="#" className="text-dark">
                    Terms and Conditions
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
  )
}

export default LoginComponent