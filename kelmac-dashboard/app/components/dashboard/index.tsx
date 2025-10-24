import React from 'react'

function MainDashboard() {
  return (
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-body">
                  <div className="dash-widget-header">
                    <span className="dash-widget-icon bg-1">
                      <i data-feather="users" className="text-warning" />
                    </span>
                    <div className="dash-count">
                      <div className="dash-title">Total client</div>
                      <div className="dash-counts">
                        <p>13</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-body">
                  <div className="dash-widget-header">
                    <span className="dash-widget-icon bg-2">
                      <i data-feather="briefcase" className="text-info" />
                    </span>
                    <div className="dash-count">
                      <div className="dash-title">Companies</div>
                      <div className="dash-counts">
                        <p>12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-body">
                  <div className="dash-widget-header">
                    <span className="dash-widget-icon bg-3">
                      <i data-feather="wifi" className="text-success" />
                    </span>
                    <div className="dash-count">
                      <div className="dash-title">Online Client</div>
                      <div className="dash-counts">
                        <p>5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-body">
                  <div className="dash-widget-header">
                    <span className="dash-widget-icon bg-4">
                      <i data-feather="video" className="text-info" />
                    </span>
                    <div className="dash-count">
                      <div className="dash-title">% of using video call</div>
                      <div className="dash-counts">
                        <p>20%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="card card-table">
                <div className="card-header">
                  <div className="row">
                    <div className="col">
                      <h5 className="card-title">Recently</h5>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-stripped table-hover datatable">
                      <thead className="thead-light">
                        <tr>
                          <th>#</th>
                          <th>Company Name</th>
                          <th>Client Name</th>
                          <th>Date Joined</th>
                          <th>Plan Type</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1234</td>
                          <td>IconicTek</td>
                          <td>John Doe</td>
                          <td>4/4/2025</td>
                          <td>Basic</td>
                          <td>123-456-7890</td>
                          <td>cms@iconictek.com</td>
                          <td className="text-center">
                            <div className="dropdown dropdown-action">
                              <a
                                href="#"
                                className="action-icon dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fas fa-ellipsis-v" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-edit me-2" />
                                  Edit
                                </a>
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-eye me-2" />
                                  View
                                </a>
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-trash-alt me-2" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>1245</td>
                          <td>Webtek</td>
                          <td>John Doe</td>
                          <td>4/1/2025</td>
                          <td>Stannard</td>
                          <td>123-456-7890</td>
                          <td>sales@iconictek.com</td>
                          <td className="text-center">
                            <div className="dropdown dropdown-action">
                              <a
                                href="#"
                                className="action-icon dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fas fa-ellipsis-v" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-edit me-2" />
                                  Edit
                                </a>
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-eye me-2" />
                                  View
                                </a>
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-trash-alt me-2" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>4568</td>
                          <td>ABC</td>
                          <td>Irfan</td>
                          <td>3/3/2025</td>
                          <td>Basic</td>
                          <td>123-456-7890</td>
                          <td>cms@iconictek.com</td>
                          <td className="text-center">
                            <div className="dropdown dropdown-action">
                              <a
                                href="#"
                                className="action-icon dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fas fa-ellipsis-v" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-edit me-2" />
                                  Edit
                                </a>
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-eye me-2" />
                                  View
                                </a>
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-trash-alt me-2" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>1234</td>
                          <td>xyz</td>
                          <td>Misbah</td>
                          <td>3/3/2025</td>
                          <td>Standard</td>
                          <td>123-456-7890</td>
                          <td>sale@iconictek.com</td>
                          <td className="text-center">
                            <div className="dropdown dropdown-action">
                              <a
                                href="#"
                                className="action-icon dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fas fa-ellipsis-v" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-edit me-2" />
                                  Edit
                                </a>
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-eye me-2" />
                                  View
                                </a>
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-trash-alt me-2" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>2345</td>
                          <td>WBC</td>
                          <td>Ahmed</td>
                          <td>3/7/2025</td>
                          <td>Basic</td>
                          <td>123-456-7890</td>
                          <td>sms@iconictek.com</td>
                          <td className="text-center">
                            <div className="dropdown dropdown-action">
                              <a
                                href="#"
                                className="action-icon dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fas fa-ellipsis-v" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-edit me-2" />
                                  Edit
                                </a>
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-eye me-2" />
                                  View
                                </a>
                                <a className="dropdown-item" href="#">
                                  <i className="far fa-trash-alt me-2" />
                                  Delete
                                </a>
                              </div>
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
        </div>
      </div>
  )
}

export default MainDashboard