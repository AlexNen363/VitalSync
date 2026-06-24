const LoginForm = ({
    formData,
    changeHandler,
    submitHandler,
    selectedRole
}) => {

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">

            <div
                className="card shadow p-4"
                style={{
                    width: "450px"
                }}
            >

                {/* Logo */}

                <div
                    className="mx-auto border d-flex justify-content-center align-items-center mb-4"
                    style={{
                        width: "150px",
                        height: "150px"
                    }}
                >
                    <h4>LOGO</h4>
                </div>

                {/* Welcome */}

                <div className="text-center mb-4">
                    <h3>
                        Welcome Back
                    </h3>

                    <p className="text-muted">
                        {selectedRole}
                    </p>
                </div>

                {/* Form */}

                <form onSubmit={submitHandler}>

                    <div className="mb-3">
                        <input
                            type="text"
                            name="Username"
                            className="form-control"
                            placeholder="Enter Username"
                            value={formData.Username}
                            onChange={changeHandler}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            name="Password"
                            className="form-control"
                            placeholder="Enter Password"
                            value={formData.Password}
                            onChange={changeHandler}
                            required
                        />
                    </div>

                    <div className="form-check mb-4">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMe"
                        />

                        <label
                            htmlFor="rememberMe"
                            className="form-check-label"
                        >
                            Remember Me
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                    >
                        SIGN IN
                    </button>

                </form>

            </div>

        </div>
    );
};

export default LoginForm;