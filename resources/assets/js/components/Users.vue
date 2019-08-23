<template>
    <div class="container">
        <div class="row mt-3" v-show="$gate.isAdminOrIsAuthor()">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>
                        <div class="card-tools">
                            <button data-toggle="modal" data-target="#addNew" class="btn btn-success">Add User
                                <i class="fa fa-user-plus fa-fw"></i>
                            </button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="card-body table-responsive table-bordered">
                        <table class="table table-hover">
                            <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Registered At</th>
                                <th>Modify</th>
                            </tr>
                            <tr v-for="user in users" :key="user.id">
                                <td>{{user.id}}</td>
                                <td>{{user.name}}</td>
                                <td>{{user.email}}</td>
                                <td>{{user.type | upText}}</td>
                                <td>{{user.created_at | myDate}}</td>
                                <td>
                                    <a href="#" @click="editModal(user)">
                                        <i class="fa fa-user-edit"></i>
                                    </a>
                                    |
                                    <a href="#" @click="deleteUser(user.id)">
                                        <i class="fa fa-trash-alt red"></i>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.box-body -->
                </div>
                <!-- /.box -->
            </div>
        </div>

        <!--        if user is not admin -->
        <div v-show="!$gate.isAdminOrIsAuthor()">
            <not-found></not-found>
        </div>
        <!-- Modal -->

        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewModal"
             aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-show="!editMode" class="modal-title" id="exampleModalLabel">Add New</h5>
                        <h5 v-show="editMode" class="modal-title" id="exampleModalLabelUpdate">Update User Info</h5>
                        <button @click="newModal()" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editMode ? updateUser() : createUser()" @keydown="form.onKeydown($event)">
                        <div class="modal-body">

                            <div class="form-group">
                                <input placeholder="Name..." v-model="form.name" type="text" name="name"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <input placeholder="Email..." v-model="form.email" type="text" name="email"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>
                            <div class="form-group">
                                <textarea placeholder="Bio (Optional)" v-model="form.bio" type="text" name="bio"
                                          class="form-control"
                                          :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>
                            <div class="form-group">
                                <select class="form-control" v-model="form.type" id="type"
                                        name="type"
                                        :class="{'is-valid':form.errors.has('type')}">
                                    <option value="">Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Standard User</option>
                                    <option value="author">author</option>
                                    <has-error :form="form" field="type"></has-error>
                                </select></div>

                            <div class="form-group">
                                <input placeholder="Password..." v-model="form.password" type="password" name="password"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>


                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button v-show="editMode" type="submit" class="btn btn-success">Update</button>
                            <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                editMode: false,
                users: {},
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    bio: '',
                    type: '',
                    photo: '',
                    created_at: '',
                    password: ''
                })
            }
        },
        methods: {
            editModal(user) {
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);

            },
            newModal() {
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },
            deleteUser(id) {
                swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        this.form.delete('/api/user/' + id).then(() => {
                            swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            );
                            Fire.$emit('updateTable');
                        }).catch(() => {
                            swal.fire(
                                'failed!',
                                'the user not deleted',
                                'warning'
                            )
                        });

                    }
                })
            },
            createUser() {
                this.$Progress.start();
                this.form.post('api/user')
                    .then(() => {
                        Fire.$emit('updateTable');
                        toast.fire({
                            type: 'success',
                            title: 'User Created  successfully'
                        });
                        // this.loadUsers();
                        $('#addNew').modal('hide');
                        this.$Progress.finish();
                    }).catch(() => {
                    toast.fire({
                        type: 'failed',
                        title: 'User Not Created'
                    });
                });

            },
            updateUser() {
                this.$Progress.start();
                this.form.patch('/api/user/' + this.form.id)
                    .then(() => {
                        Fire.$emit('updateTable');
                        toast.fire({
                            type: 'success',
                            title: 'User information update successfully'
                        });
                    })
                    .catch(() => {
                        toast.fire({
                            type: 'warning',
                            title: 'User information not updated!'
                        });
                    });
                this.$Progress.finish();
                $('#addNew').modal('hide');
            },
            loadUsers() {
                if (this.$gate.isAdminOrIsAuthor()) {
                    axios.get('/api/user').then(({data}) => (this.users = data.data));
                }
            },
        },
        created() {
            this.loadUsers();
            Fire.$on('updateTable', () => {
                this.loadUsers();
            });
            // setInterval(() => this.loadUsers(),5000);
        }
    }
</script>
