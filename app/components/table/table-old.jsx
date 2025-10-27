import React, { useState } from "react";
import avatar from "../../assets/img/profiles/avatar-04.jpg";

import Image from "next/image";
import Link from "next/link";

function Table({ path }) {
  const [editDropDown, setEditDropDown] = useState(false);
  return (
    <>
      <div className="row">
        <div className="col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col">
                  <h5 className="card-title">Jobs in progress</h5>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-stripped table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>Name / Email</th>
                      <th>Phone / Join Date</th>
                      <th>Jobs Posted</th>
                      <th>Active Job</th>
                      <th>Amount Spend</th>
                      <th>Amount in-wallet</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <h2 className="table-avatar">
                          <Link href="#" className="avatar avatar-sm me-2">
                            <Image
                              src={avatar}
                              alt="Logo"
                              width={45}
                              height={45}
                              objectFit="cover"
                            />
                          </Link>
                          <Link href="#">
                            Client One <span>client@rialingo.com</span>
                          </Link>
                        </h2>
                      </td>
                      <td>
                        0303-9049868
                        <br />
                        <span className="badge bg-primary  rounded-pill">
                          10-24-2023
                        </span>
                      </td>
                      <td>2</td>
                      <td>
                        <h2 className="table-avatar">
                          <Link href="#">
                            Abdullah <span>Test</span>
                          </Link>
                        </h2>
                      </td>
                      <td>$0</td>
                      <td>$0</td>
                      <td>
                        <span className="badge bg-success rounded-pill  px-3">
                          Active
                        </span>
                      </td>
                      <td className="text-center ">
                        <div className="dropdown dropdown-action">
                          <Link
                            href="#"
                            className="action-icon dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            onClick={() => setEditDropDown(!editDropDown)}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </Link>

                          {editDropDown && (
                            <div
                              className="dropdown-menu dropdown-menu-right show"
                              data-popper-placement="bottom-end"
                              style={{
                                position: "absolute",
                                inset: "0px 0px auto auto",
                                margin: 0,
                                transform: "translate(-21px, 29px)",
                              }}
                            >
                              <Link className="dropdown-item" href="#">
                                <i className="far fa-eye me-2" /> View Details
                              </Link>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Table;
